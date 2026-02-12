import express from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { progressSaveLimiter, progressLoadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Batch load ALL progress for current user (single request)
// Rate limited: 20 requests per minute
router.get('/load-all', progressLoadLimiter, async (req, res, next) => {
    try {
        // Fetch all progress for this user
        const result = await query(
            `SELECT checklist_type, checklist_id, item_key, completed, completed_at 
             FROM builtin_progress 
             WHERE user_id = $1::uuid 
             AND completed = true`,
            [req.user.id]
        );

        // Group by checklist_type and checklist_id
        const progress = {
            language_dsa: {},
            language_dev: {},
            dsa_topics: {},
            examination: {}
        };

        result.rows.forEach(row => {
            const { checklist_type, checklist_id, item_key } = row;

            if (!progress[checklist_type]) {
                progress[checklist_type] = {};
            }

            if (!progress[checklist_type][checklist_id]) {
                progress[checklist_type][checklist_id] = {};
            }

            progress[checklist_type][checklist_id][item_key] = true;
        });

        res.json(progress);
    } catch (error) {
        next(error);
    }
});

// Get progress for a specific checklist
router.get('/:type/:id', async (req, res, next) => {
    try {
        const { type, id } = req.params;

        // Validate checklist type
        const validTypes = ['language_dsa', 'language_dev', 'dsa_topics', 'examination'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: { message: 'Invalid checklist type', status: 400 }
            });
        }

        const result = await query(
            `SELECT item_key, completed, completed_at 
             FROM builtin_progress 
             WHERE user_id = $1::uuid 
             AND checklist_type = $2 
             AND checklist_id = $3
             AND completed = true`,
            [req.user.id, type, id]
        );

        // Convert to object format: { "item_key": true, ... }
        const progress = {};
        result.rows.forEach(row => {
            progress[row.item_key] = true;
        });

        res.json(progress);
    } catch (error) {
        next(error);
    }
});

// Batch update progress items
router.post('/batch', async (req, res, next) => {
    try {
        const { type, id, items } = req.body;

        if (!type || !id || !items || typeof items !== 'object') {
            return res.status(400).json({
                error: { message: 'type, id, and items object are required', status: 400 }
            });
        }

        // Validate checklist type
        const validTypes = ['language_dsa', 'language_dev', 'dsa_topics', 'examination'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: { message: 'Invalid checklist type', status: 400 }
            });
        }

        // Get current progress
        const currentResult = await query(
            `SELECT item_key FROM builtin_progress 
             WHERE user_id = $1::uuid 
             AND checklist_type = $2 
             AND checklist_id = $3`,
            [req.user.id, type, id]
        );

        const currentItems = new Set(currentResult.rows.map(row => row.item_key));
        const newItems = Object.keys(items).filter(key => items[key] === true);

        // Items to insert (checked but not in DB)
        const toInsert = newItems.filter(key => !currentItems.has(key));

        // Items to delete (unchecked but in DB)
        const toDelete = Array.from(currentItems).filter(key => !items[key]);

        // Insert new checked items
        for (const itemKey of toInsert) {
            await query(
                `INSERT INTO builtin_progress (user_id, checklist_type, checklist_id, item_key, completed, completed_at)
                 VALUES ($1::uuid, $2, $3, $4, true, NOW())
                 ON CONFLICT (user_id, checklist_type, checklist_id, item_key) 
                 DO UPDATE SET completed = true, completed_at = NOW()`,
                [req.user.id, type, id, itemKey]
            );
        }

        // Delete unchecked items
        if (toDelete.length > 0) {
            await query(
                `DELETE FROM builtin_progress 
                 WHERE user_id = $1::uuid 
                 AND checklist_type = $2 
                 AND checklist_id = $3 
                 AND item_key = ANY($4::text[])`,
                [req.user.id, type, id, toDelete]
            );
        }

        res.json({
            message: 'Progress updated successfully',
            inserted: toInsert.length,
            deleted: toDelete.length
        });
    } catch (error) {
        next(error);
    }
});

// Batch update ALL progress items (multiple checklists in one request)
// Rate limited: 20 requests per minute
router.post('/batch-all', progressSaveLimiter, async (req, res, next) => {
    try {
        const { checklists } = req.body;
        console.log(`[Batch-All] User ${req.user.id} saving ${checklists?.length || 0} checklists`);

        if (!checklists || !Array.isArray(checklists)) {
            console.warn('[Batch-All] Invalid checklists payload:', req.body);
            return res.status(400).json({
                error: { message: 'checklists array is required', status: 400 }
            });
        }

        const validTypes = ['language_dsa', 'language_dev', 'dsa_topics', 'examination'];
        let totalInserted = 0;
        let totalDeleted = 0;

        // Process each checklist
        for (const checklist of checklists) {
            const { type, id, items } = checklist;

            // Console log for debugging EC2 issues
            console.log(`[Batch-All] Processing ${type}/${id} with ${Object.keys(items || {}).length} items`);

            if (!type || !id || !items || typeof items !== 'object') {
                console.warn(`[Batch-All] Skipping invalid checklist: ${JSON.stringify(checklist)}`);
                continue; // Skip invalid checklists
            }

            if (!validTypes.includes(type)) {
                console.warn(`[Batch-All] Invalid type: ${type}`);
                continue; // Skip invalid types
            }

            // Get current progress for this checklist
            const currentResult = await query(
                `SELECT item_key FROM builtin_progress 
                 WHERE user_id = $1::uuid 
                 AND checklist_type = $2 
                 AND checklist_id = $3`,
                [req.user.id, type, id]
            );

            const currentItems = new Set(currentResult.rows.map(row => row.item_key));
            const newItems = Object.keys(items).filter(key => items[key] === true);

            // Items to insert (checked but not in DB)
            const toInsert = newItems.filter(key => !currentItems.has(key));

            // Items to delete (unchecked but in DB)
            const toDelete = Array.from(currentItems).filter(key => !items[key]);

            console.log(`[Batch-All] ${type}/${id}: Inserting ${toInsert.length}, Deleting ${toDelete.length}`);

            // Insert new checked items
            for (const itemKey of toInsert) {
                await query(
                    `INSERT INTO builtin_progress (user_id, checklist_type, checklist_id, item_key, completed, completed_at)
                     VALUES ($1::uuid, $2, $3, $4, true, NOW())
                     ON CONFLICT (user_id, checklist_type, checklist_id, item_key) 
                     DO UPDATE SET completed = true, completed_at = NOW()`,
                    [req.user.id, type, id, itemKey]
                );
                totalInserted++;
            }

            // Delete unchecked items
            if (toDelete.length > 0) {
                const deleteResult = await query(
                    `DELETE FROM builtin_progress 
                     WHERE user_id = $1::uuid 
                     AND checklist_type = $2 
                     AND checklist_id = $3 
                     AND item_key = ANY($4::text[])`,
                    [req.user.id, type, id, toDelete]
                );
                totalDeleted += deleteResult.rowCount;
            }
        }

        console.log(`[Batch-All] Complete. Inserted: ${totalInserted}, Deleted: ${totalDeleted}`);

        res.json({
            message: 'All progress updated successfully',
            checklists_processed: checklists.length,
            total_inserted: totalInserted,
            total_deleted: totalDeleted
        });
    } catch (error) {
        next(error);
    }
});

// Reset progress for a checklist
router.delete('/:type/:id', async (req, res, next) => {
    try {
        const { type, id } = req.params;

        // Validate checklist type
        const validTypes = ['language_dsa', 'language_dev', 'dsa_topics', 'examination'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: { message: 'Invalid checklist type', status: 400 }
            });
        }

        const result = await query(
            `DELETE FROM builtin_progress 
             WHERE user_id = $1::uuid 
             AND checklist_type = $2 
             AND checklist_id = $3 
             RETURNING *`,
            [req.user.id, type, id]
        );

        res.json({
            message: 'Progress reset successfully',
            deleted_count: result.rowCount
        });
    } catch (error) {
        next(error);
    }
});

export default router;
