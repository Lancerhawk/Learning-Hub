import express from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { listCreationLimiter } from '../middleware/rateLimiter.js';
import { validateUUIDs } from '../middleware/validateUUID.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all custom lists for current user (with basic info only)
router.get('/', async (req, res, next) => {
    try {
        const result = await query(
            `SELECT cl.*, 
                    u.username as owner_username,
                    ocl.title as original_title,
                    ou.username as original_owner_username
             FROM custom_lists cl
             LEFT JOIN users u ON cl.user_id = u.id
             LEFT JOIN custom_lists ocl ON cl.original_list_id = ocl.id
             LEFT JOIN users ou ON ocl.user_id = ou.id
             WHERE cl.user_id = $1::uuid
             ORDER BY cl.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Get single list with all nested data (sections, topics, resources)
router.get('/:id', validateUUIDs('id'), async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get list - check ownership
        const listResult = await query(
            `SELECT cl.*, 
                    u.username as owner_username,
                    ocl.title as original_title,
                    ou.username as original_owner_username
             FROM custom_lists cl
             LEFT JOIN users u ON cl.user_id = u.id
             LEFT JOIN custom_lists ocl ON cl.original_list_id = ocl.id
             LEFT JOIN users ou ON ocl.user_id = ou.id
             WHERE cl.id = $1 AND cl.user_id = $2::uuid`,
            [id, req.user.id]
        );

        if (listResult.rows.length === 0) {
            return res.status(404).json({ error: { message: 'List not found', status: 404 } });
        }

        const list = listResult.rows[0];

        // Get sections
        const sectionsResult = await query(
            `SELECT * FROM custom_sections 
       WHERE list_id = $1 
       ORDER BY order_index ASC`,
            [id]
        );

        // Get all topics for this list
        const topicsResult = await query(
            `SELECT t.* FROM custom_topics t
       INNER JOIN custom_sections s ON t.section_id = s.id
       WHERE s.list_id = $1
       ORDER BY t.order_index ASC`,
            [id]
        );

        // Get all resources for this list
        const resourcesResult = await query(
            `SELECT r.* FROM custom_resources r
       INNER JOIN custom_topics t ON r.topic_id = t.id
       INNER JOIN custom_sections s ON t.section_id = s.id
       WHERE s.list_id = $1
       ORDER BY r.order_index ASC`,
            [id]
        );

        // Build nested structure
        const sections = sectionsResult.rows.map(section => {
            const sectionTopics = topicsResult.rows
                .filter(t => t.section_id === section.id && !t.parent_topic_id)
                .map(topic => {
                    const topicResources = resourcesResult.rows
                        .filter(r => r.topic_id === topic.id);

                    const subtopics = topicsResult.rows
                        .filter(t => t.parent_topic_id === topic.id)
                        .map(subtopic => {
                            const subtopicResources = resourcesResult.rows
                                .filter(r => r.topic_id === subtopic.id);
                            return {
                                ...subtopic,
                                resources: subtopicResources
                            };
                        });

                    return {
                        ...topic,
                        resources: topicResources,
                        subtopics
                    };
                });

            return {
                ...section,
                topics: sectionTopics
            };
        });

        res.json({
            ...list,
            sections
        });
    } catch (error) {
        next(error);
    }
});

// Create new list - with rate limiting
router.post('/', listCreationLimiter, async (req, res, next) => {
    try {
        const { title, description, icon = '📚', is_public = false } = req.body;

        if (!title) {
            return res.status(400).json({ error: { message: 'Title is required', status: 400 } });
        }

        const result = await query(
            `INSERT INTO custom_lists (title, description, icon, user_id, is_public) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [title, description, icon, req.user.id, is_public]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update list
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, icon, is_public } = req.body;

        const result = await query(
            `UPDATE custom_lists 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           icon = COALESCE($3, icon),
           is_public = COALESCE($4, is_public)
       WHERE id = $5 AND user_id = $6::uuid
       RETURNING *`,
            [title, description, icon, is_public, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'List not found or unauthorized', status: 404 } });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete list
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM custom_lists WHERE id = $1 AND user_id = $2::uuid RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'List not found or unauthorized', status: 404 } });
        }

        res.json({ message: 'List deleted successfully', list: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

export default router;

