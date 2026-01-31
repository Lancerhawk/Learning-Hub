import express from 'express';
import pool from '../db.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { validateUUIDs } from '../middleware/validateUUID.js';

const router = express.Router();

// GET /api/public-lists - Get all public lists with search and filtering
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { search = '', sort = 'recent', limit = 20, offset = 0 } = req.query;

        let orderBy = 'cl.created_at DESC'; // default: recent

        if (sort === 'rating') {
            orderBy = '(CASE WHEN cl.rating_count > 0 THEN cl.rating_sum::float / cl.rating_count ELSE 0 END) DESC, cl.created_at DESC';
        } else if (sort === 'popular') {
            orderBy = 'cl.copy_count DESC, cl.created_at DESC';
        }

        const query = `
            SELECT 
                cl.id,
                cl.title,
                cl.description,
                cl.icon,
                cl.rating_count,
                cl.rating_sum,
                cl.copy_count,
                cl.created_at,
                cl.user_id,
                cl.original_list_id,
                u.username as owner_username,
                ocl.title as original_title,
                ou.username as original_creator_username,
                COUNT(DISTINCT cs.id) as section_count,
                COUNT(DISTINCT ct.id) as topic_count
            FROM custom_lists cl
            LEFT JOIN users u ON cl.user_id = u.id
            LEFT JOIN custom_lists ocl ON cl.original_list_id = ocl.id
            LEFT JOIN users ou ON ocl.user_id = ou.id
            LEFT JOIN custom_sections cs ON cl.id = cs.list_id
            LEFT JOIN custom_topics ct ON cs.id = ct.section_id
            WHERE cl.is_public = true
                AND (cl.title ILIKE $1 OR cl.description ILIKE $1)
            GROUP BY cl.id, cl.original_list_id, u.username, ocl.title, ou.username
            ORDER BY ${orderBy}
            LIMIT $2 OFFSET $3
        `;

        const result = await pool.query(query, [`%${search}%`, limit, offset]);

        // Calculate average rating for each list
        const lists = result.rows.map(list => ({
            ...list,
            averageRating: list.rating_count > 0
                ? (list.rating_sum / list.rating_count).toFixed(1)
                : 0,
            userRating: null // Will be populated if user is authenticated
        }));

        // If user is authenticated, get their ratings
        if (req.user) {
            const listIds = lists.map(l => l.id);
            if (listIds.length > 0) {
                const ratingsResult = await pool.query(
                    'SELECT list_id, rating FROM list_ratings WHERE user_id = $1::uuid AND list_id = ANY($2)',
                    [req.user.id, listIds]
                );

                const ratingsMap = {};
                ratingsResult.rows.forEach(r => {
                    ratingsMap[r.list_id] = r.rating;
                });

                lists.forEach(list => {
                    list.userRating = ratingsMap[list.id] || null;
                });
            }
        }

        // Get total count for pagination
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM custom_lists WHERE is_public = true AND (title ILIKE $1 OR description ILIKE $1)',
            [`%${search}%`]
        );

        res.json({
            lists,
            total: parseInt(countResult.rows[0].count),
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Get public lists error:', error);
        res.status(500).json({ error: 'Failed to fetch public lists' });
    }
});

// GET /api/public-lists/:id - Get a specific public list with full details
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Get list with owner info
        const listResult = await pool.query(`
            SELECT 
                cl.*,
                u.username as owner_username,
                u.id as owner_id,
                ol.title as original_title,
                ou.username as original_owner_username
            FROM custom_lists cl
            LEFT JOIN users u ON cl.user_id = u.id
            LEFT JOIN custom_lists ol ON cl.original_list_id = ol.id
            LEFT JOIN users ou ON ol.user_id = ou.id
            WHERE cl.id = $1 AND cl.is_public = true
        `, [id]);

        if (listResult.rows.length === 0) {
            return res.status(404).json({ error: 'List not found or not public' });
        }

        const list = listResult.rows[0];

        // Get sections with topics and resources
        const sectionsResult = await pool.query(`
            SELECT 
                cs.id,
                cs.title,
                cs.icon,
                cs.order_index,
                json_agg(
                    json_build_object(
                        'id', ct.id,
                        'title', ct.title,
                        'order_index', ct.order_index,
                        'resources', (
                            SELECT json_agg(
                                json_build_object(
                                    'id', cr.id,
                                    'type', cr.type,
                                    'title', cr.title,
                                    'url', cr.url,
                                    'platform', cr.platform,
                                    'order_index', cr.order_index
                                ) ORDER BY cr.order_index
                            )
                            FROM custom_resources cr
                            WHERE cr.topic_id = ct.id
                        )
                    ) ORDER BY ct.order_index
                ) as topics
            FROM custom_sections cs
            LEFT JOIN custom_topics ct ON cs.id = ct.section_id
            WHERE cs.list_id = $1
            GROUP BY cs.id
            ORDER BY cs.order_index
        `, [id]);

        list.sections = sectionsResult.rows;

        // Calculate average rating
        list.averageRating = list.rating_count > 0
            ? (list.rating_sum / list.rating_count).toFixed(1)
            : 0;

        // Get user's rating if authenticated
        if (req.user) {
            const ratingResult = await pool.query(
                'SELECT rating FROM list_ratings WHERE list_id = $1 AND user_id = $2::uuid',
                [id, req.user.id]
            );
            list.userRating = ratingResult.rows[0]?.rating || null;
        } else {
            list.userRating = null;
        }

        res.json(list);
    } catch (error) {
        console.error('Get public list error:', error);
        res.status(500).json({ error: 'Failed to fetch list' });
    }
});

// GET /api/public-lists/:id/lineage - Get the full lineage/version history of a list
router.get('/:id/lineage', async (req, res) => {
    try {
        const { id } = req.params;
        const lineage = [];

        // Recursive function to trace back to original
        const traceLineage = async (listId) => {
            const result = await pool.query(`
                SELECT 
                    cl.id,
                    cl.title,
                    cl.user_id,
                    cl.original_list_id,
                    cl.created_at,
                    cl.is_public,
                    u.username
                FROM custom_lists cl
                LEFT JOIN users u ON cl.user_id = u.id
                WHERE cl.id = $1
            `, [listId]);

            if (result.rows.length === 0) return;

            const list = result.rows[0];
            lineage.unshift({
                id: list.id,
                title: list.title,
                username: list.username,
                user_id: list.user_id,
                created_at: list.created_at,
                is_public: list.is_public
            });

            // If this list was copied from another, trace that one too
            if (list.original_list_id) {
                await traceLineage(list.original_list_id);
            }
        };

        await traceLineage(id);

        res.json({ lineage });
    } catch (error) {
        console.error('Get lineage error:', error);
        res.status(500).json({ error: 'Failed to fetch lineage' });
    }
});

// POST /api/public-lists/:id/rate - Rate a public list
router.post('/:id/rate', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if list exists and is public
        const listResult = await pool.query(
            'SELECT id FROM custom_lists WHERE id = $1 AND is_public = true',
            [id]
        );

        if (listResult.rows.length === 0) {
            return res.status(404).json({ error: 'List not found or not public' });
        }

        // Upsert rating
        await pool.query(`
            INSERT INTO list_ratings (list_id, user_id, rating)
            VALUES ($1, $2::uuid, $3)
            ON CONFLICT (list_id, user_id)
            DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
        `, [id, req.user.id, rating]);

        // Get updated average rating
        const avgResult = await pool.query(
            'SELECT rating_count, rating_sum FROM custom_lists WHERE id = $1',
            [id]
        );

        const { rating_count, rating_sum } = avgResult.rows[0];
        const averageRating = rating_count > 0 ? (rating_sum / rating_count).toFixed(1) : 0;

        res.json({
            message: 'Rating submitted successfully',
            averageRating,
            ratingCount: rating_count,
            userRating: rating
        });
    } catch (error) {
        console.error('Rate list error:', error);
        res.status(500).json({ error: 'Failed to rate list' });
    }
});

// POST /api/public-lists/:id/copy - Copy a public list to user's account
router.post('/:id/copy', authMiddleware, async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id } = req.params;

        // Get the original list
        const listResult = await client.query(`
            SELECT * FROM custom_lists 
            WHERE id = $1 AND is_public = true
        `, [id]);

        if (listResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'List not found or not public' });
        }

        const originalList = listResult.rows[0];

        // Create a copy of the list
        const newListResult = await client.query(`
            INSERT INTO custom_lists (title, description, icon, user_id, is_public, original_list_id)
            VALUES ($1, $2, $3, $4::uuid, false, $5)
            RETURNING id
        `, [
            originalList.title + ' (Copy)',
            originalList.description,
            originalList.icon,
            req.user.id,
            id
        ]);

        const newListId = newListResult.rows[0].id;

        // Copy sections
        const sectionsResult = await client.query(
            'SELECT * FROM custom_sections WHERE list_id = $1 ORDER BY order_index',
            [id]
        );

        for (const section of sectionsResult.rows) {
            const newSectionResult = await client.query(`
                INSERT INTO custom_sections (list_id, title, icon, order_index)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [newListId, section.title, section.icon, section.order_index]);

            const newSectionId = newSectionResult.rows[0].id;

            // Copy topics
            const topicsResult = await client.query(
                'SELECT * FROM custom_topics WHERE section_id = $1 ORDER BY order_index',
                [section.id]
            );

            for (const topic of topicsResult.rows) {
                const newTopicResult = await client.query(`
                    INSERT INTO custom_topics (section_id, title, order_index, parent_topic_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `, [newSectionId, topic.title, topic.order_index, topic.parent_topic_id]);

                const newTopicId = newTopicResult.rows[0].id;

                // Copy resources
                const resourcesResult = await client.query(
                    'SELECT * FROM custom_resources WHERE topic_id = $1 ORDER BY order_index',
                    [topic.id]
                );

                for (const resource of resourcesResult.rows) {
                    await client.query(`
                        INSERT INTO custom_resources (topic_id, type, title, url, platform, order_index)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `, [newTopicId, resource.type, resource.title, resource.url, resource.platform, resource.order_index]);
                }
            }
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: 'List copied successfully',
            listId: newListId
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Copy list error:', error);
        res.status(500).json({ error: 'Failed to copy list' });
    } finally {
        client.release();
    }
});

export default router;
