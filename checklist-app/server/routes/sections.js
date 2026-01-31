import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Create section
router.post('/', async (req, res, next) => {
    try {
        const { list_id, title, icon = '📁', order_index } = req.body;

        if (!list_id || !title) {
            return res.status(400).json({
                error: { message: 'list_id and title are required', status: 400 }
            });
        }

        // Get next order_index if not provided
        let finalOrderIndex = order_index;
        if (finalOrderIndex === undefined) {
            const maxOrderResult = await query(
                'SELECT COALESCE(MAX(order_index), -1) + 1 as next_order FROM custom_sections WHERE list_id = $1',
                [list_id]
            );
            finalOrderIndex = maxOrderResult.rows[0].next_order;
        }

        const result = await query(
            `INSERT INTO custom_sections (list_id, title, icon, order_index) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
            [list_id, title, icon, finalOrderIndex]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update section
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, icon, order_index } = req.body;

        const result = await query(
            `UPDATE custom_sections 
       SET title = COALESCE($1, title),
           icon = COALESCE($2, icon),
           order_index = COALESCE($3, order_index)
       WHERE id = $4
       RETURNING *`,
            [title, icon, order_index, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Section not found', status: 404 } });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete section
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM custom_sections WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Section not found', status: 404 } });
        }

        res.json({ message: 'Section deleted successfully', section: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Reorder sections
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
            `UPDATE custom_sections 
       SET order_index = $1
       WHERE id = $2
       RETURNING *`,
            [new_order_index, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: { message: 'Section not found', status: 404 } });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

export default router;
