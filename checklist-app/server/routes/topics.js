import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Create topic
router.post('/', async (req, res, next) => {
    try {
        const { section_id, parent_topic_id, title, order_index } = req.body;

        if (!section_id || !title) {
            return res.status(400).json({
                error: { message: 'section_id and title are required', status: 400 }
            });
        }

        // Get next order_index if not provided
        let finalOrderIndex = order_index;
        if (finalOrderIndex === undefined) {
            const condition = parent_topic_id
                ? 'parent_topic_id = $1'
                : 'section_id = $1 AND parent_topic_id IS NULL';
            const param = parent_topic_id || section_id;

            const maxOrderResult = await query(
                `SELECT COALESCE(MAX(order_index), -1) + 1 as next_order 
         FROM custom_topics 
         WHERE ${condition}`,
                [param]
            );
            finalOrderIndex = maxOrderResult.rows[0].next_order;
        }

        const result = await query(
            `INSERT INTO custom_topics (section_id, parent_topic_id, title, order_index) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
            [section_id, parent_topic_id || null, title, finalOrderIndex]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update topic
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, order_index } = req.body;

        const result = await query(
            `UPDATE custom_topics 
       SET title = COALESCE($1, title),
           order_index = COALESCE($2, order_index)
       WHERE id = $3
       RETURNING *`,
            [title, order_index, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Topic not found', status: 404 } });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete topic
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM custom_topics WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Topic not found', status: 404 } });
        }

        res.json({ message: 'Topic deleted successfully', topic: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Reorder topic
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
            `UPDATE custom_topics 
       SET order_index = $1
       WHERE id = $2
       RETURNING *`,
            [new_order_index, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Topic not found', status: 404 } });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

export default router;
