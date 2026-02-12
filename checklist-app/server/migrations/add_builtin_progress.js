import { query } from '../db.js';

async function addBuiltinProgressTable() {
    try {
        console.log('🔄 Checking/Creating builtin_progress table...\n');

        await query(`
            CREATE TABLE IF NOT EXISTS builtin_progress (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                checklist_type VARCHAR(50) NOT NULL CHECK (checklist_type IN ('language_dsa', 'language_dev', 'dsa_topics', 'examination')),
                checklist_id VARCHAR(100) NOT NULL,
                item_key VARCHAR(500) NOT NULL,
                completed BOOLEAN DEFAULT TRUE,
                completed_at TIMESTAMP DEFAULT NOW(),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, checklist_type, checklist_id, item_key)
            );

            CREATE INDEX IF NOT EXISTS idx_builtin_progress_user ON builtin_progress(user_id);
            CREATE INDEX IF NOT EXISTS idx_builtin_progress_checklist ON builtin_progress(checklist_type, checklist_id);
            CREATE INDEX IF NOT EXISTS idx_builtin_progress_user_checklist ON builtin_progress(user_id, checklist_type, checklist_id);
        `);

        // Add trigger if it doesn't exist (simulated by dropping and recreating or handling error)
        try {
            await query(`
                DROP TRIGGER IF EXISTS update_builtin_progress_updated_at ON builtin_progress;
                CREATE TRIGGER update_builtin_progress_updated_at 
                BEFORE UPDATE ON builtin_progress
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            `);
        } catch (e) {
            console.log('Note: Trigger creation warning (might be fine):', e.message);
        }

        console.log('✅ builtin_progress table is ready!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to add table:', error.message);
        process.exit(1);
    }
}

addBuiltinProgressTable();
