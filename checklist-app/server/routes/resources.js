import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Helper function to detect platform from URL
const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('leetcode.com')) return 'LeetCode';
    if (url.includes('hackerrank.com')) return 'HackerRank';
    if (url.includes('codeforces.com')) return 'Codeforces';
    if (url.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('notion.so')) return 'Notion';
    return 'Custom';
};

// Create resource
router.post('/', async (req, res, next) => {
    try {
        const { topic_id, type, title, url, platform, order_index } = req.body;

        if (!topic_id || !type || !title || !url) {
            return res.status(400).json({
                error: { message: 'topic_id, type, title, and url are required', status: 400 }
            });
        }

        // Validate type
        const validTypes = ['video', 'note', 'link', 'practice'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: { message: `Type must be one of: ${validTypes.join(', ')}`, status: 400 }
            });
        }

        // Auto-detect platform if not provided
        const finalPlatform = platform || detectPlatform(url);

        // Get next order_index if not provided
        let finalOrderIndex = order_index;
        if (finalOrderIndex === undefined) {
            const maxOrderResult = await query(
                'SELECT COALESCE(MAX(order_index), -1) + 1 as next_order FROM custom_resources WHERE topic_id = $1',
                [topic_id]
            );
            finalOrderIndex = maxOrderResult.rows[0].next_order;
        }

        const result = await query(
            `INSERT INTO custom_resources (topic_id, type, title, url, platform, order_index) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
            [topic_id, type, title, url, finalPlatform, finalOrderIndex]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update resource
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { type, title, url, platform, order_index } = req.body;

        // Validate type if provided
        if (type) {
            const validTypes = ['video', 'note', 'link', 'practice'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    error: { message: `Type must be one of: ${validTypes.join(', ')}`, status: 400 }
                });
            }
        }

        const result = await query(
            `UPDATE custom_resources 
       SET type = COALESCE($1, type),
           title = COALESCE($2, title),
           url = COALESCE($3, url),
           platform = COALESCE($4, platform),
           order_index = COALESCE($5, order_index)
       WHERE id = $6
       RETURNING *`,
            [type, title, url, platform, order_index, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Resource not found', status: 404 } });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete resource
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM custom_resources WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Resource not found', status: 404 } });
        }

        res.json({ message: 'Resource deleted successfully', resource: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Reorder resource
router.put('/:id/reorder', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { new_order_index } = req.body;

        if (new_order_index === undefined) {
            return res.status(400).json({
                error: { message: 'new_order_index is required', status: 400 }
            });
        }

        const result = await query(
            `UPDATE custom_resources 
       SET order_index = $1
       WHERE id = $2
       RETURNING *`,
            [new_order_index, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Resource not found', status: 404 } });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

export default router;
