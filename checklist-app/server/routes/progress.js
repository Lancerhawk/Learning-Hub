import express from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get progress for a specific list
router.get('/list/:listId', async (req, res, next) => {
    try {
        const { listId } = req.params;

        const result = await query(
            `SELECT * FROM custom_progress 
       WHERE list_id = $1 AND user_id = $2::uuid`,
            [listId, req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Toggle progress item (topic or resource)
router.post('/toggle', async (req, res, next) => {
    try {
        const { list_id, topic_id, resource_id } = req.body;

        if (!list_id || (!topic_id && !resource_id)) {
            return res.status(400).json({
                error: { message: 'list_id and either topic_id or resource_id are required', status: 400 }
            });
        }

        // Check if progress exists
        const checkResult = await query(
            `SELECT * FROM custom_progress 
       WHERE user_id = $1::uuid AND list_id = $2 AND 
             COALESCE(topic_id::text, '') = COALESCE($3::text, '') AND 
             COALESCE(resource_id::text, '') = COALESCE($4::text, '')`,
            [req.user.id, list_id, topic_id || null, resource_id || null]
        );

        if (checkResult.rows.length > 0) {
            // Toggle existing progress
            const currentCompleted = checkResult.rows[0].completed;
            const result = await query(
                `UPDATE custom_progress 
         SET completed = $1, 
             completed_at = CASE WHEN $1 THEN NOW() ELSE NULL END
         WHERE id = $2
         RETURNING *`,
                [!currentCompleted, checkResult.rows[0].id]
            );
            res.json(result.rows[0]);
        } else {
            // Create new progress entry
            const result = await query(
                `INSERT INTO custom_progress (user_id, list_id, topic_id, resource_id, completed, completed_at) 
         VALUES ($1::uuid, $2, $3, $4, true, NOW()) 
         RETURNING *`,
                [req.user.id, list_id, topic_id || null, resource_id || null]
            );
            res.status(201).json(result.rows[0]);
        }
    } catch (error) {
        next(error);
    }
});

// Mark topic and all its resources as complete
router.post('/complete-topic', async (req, res, next) => {
    try {
        const { list_id, topic_id, include_resources = true } = req.body;

        if (!list_id || !topic_id) {
            return res.status(400).json({
                error: { message: 'list_id and topic_id are required', status: 400 }
            });
        }

        // Mark topic as complete
        await query(
            `INSERT INTO custom_progress (user_id, list_id, topic_id, completed, completed_at) 
       VALUES ($1::uuid, $2, $3, true, NOW())
       ON CONFLICT (user_id, list_id, topic_id, resource_id) 
       DO UPDATE SET completed = true, completed_at = NOW()`,
            [req.user.id, list_id, topic_id]
        );

        if (include_resources) {
            // Get all resources for this topic
            const resourcesResult = await query(
                'SELECT id FROM custom_resources WHERE topic_id = $1',
                [topic_id]
            );

            // Mark all resources as complete
            for (const resource of resourcesResult.rows) {
                await query(
                    `INSERT INTO custom_progress (user_id, list_id, topic_id, resource_id, completed, completed_at) 
           VALUES ($1::uuid, $2, $3, $4, true, NOW())
           ON CONFLICT (user_id, list_id, topic_id, resource_id) 
           DO UPDATE SET completed = true, completed_at = NOW()`,
                    [req.user.id, list_id, topic_id, resource.id]
                );
            }
        }

        res.json({ message: 'Topic marked as complete', topic_id, include_resources });
    } catch (error) {
        next(error);
    }
});

// Reset progress for a list
router.delete('/list/:listId', async (req, res, next) => {
    try {
        const { listId } = req.params;

        const result = await query(
            'DELETE FROM custom_progress WHERE list_id = $1 AND user_id = $2::uuid RETURNING *',
            [listId, req.user.id]
        );

        res.json({
            message: 'Progress reset successfully',
            deleted_count: result.rowCount
        });
    } catch (error) {
        next(error);
    }
});

// Get progress statistics for a list
router.get('/list/:listId/stats', async (req, res, next) => {
    try {
        const { listId } = req.params;

        // Get total topics and completed topics
        const topicsResult = await query(
            `SELECT 
         COUNT(DISTINCT t.id) as total_topics,
         COUNT(DISTINCT CASE WHEN p.completed THEN t.id END) as completed_topics
       FROM custom_topics t
       INNER JOIN custom_sections s ON t.section_id = s.id
       LEFT JOIN custom_progress p ON t.id = p.topic_id AND p.user_id = $1::uuid AND p.resource_id IS NULL
       WHERE s.list_id = $2`,
            [req.user.id, listId]
        );

        // Get total resources and completed resources
        const resourcesResult = await query(
            `SELECT 
         COUNT(DISTINCT r.id) as total_resources,
         COUNT(DISTINCT CASE WHEN p.completed THEN r.id END) as completed_resources
       FROM custom_resources r
       INNER JOIN custom_topics t ON r.topic_id = t.id
       INNER JOIN custom_sections s ON t.section_id = s.id
       LEFT JOIN custom_progress p ON r.id = p.resource_id AND p.user_id = $1::uuid
       WHERE s.list_id = $2`,
            [req.user.id, listId]
        );

        const stats = {
            topics: {
                total: parseInt(topicsResult.rows[0].total_topics),
                completed: parseInt(topicsResult.rows[0].completed_topics)
            },
            resources: {
                total: parseInt(resourcesResult.rows[0].total_resources),
                completed: parseInt(resourcesResult.rows[0].completed_resources)
            }
        };

        const totalItems = stats.topics.total + stats.resources.total;
        const completedItems = stats.topics.completed + stats.resources.completed;
        stats.overall_progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        res.json(stats);
    } catch (error) {
        next(error);
    }
});

export default router;
