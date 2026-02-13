import { query } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateUserTable() {
    try {
        console.log('🔄 Migrating users table...\\n');

        const sqlPath = path.join(__dirname, 'migrations', 'add_migration_flag.sql');

        console.log(`📄 Adding has_migrated_localstorage column to users table\\n`);

        // Check if file exists
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Migration file not found: ${sqlPath}`);
        }

        // Read the SQL file
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the SQL
        await query(sql);

        console.log('\\n✅ Migration completed successfully!');
        console.log('✅ Added has_migrated_localstorage column to users table');
        console.log('✅ Existing users marked as already migrated\\n');

        process.exit(0);
    } catch (error) {
        console.error('\\n❌ Migration failed:', error.message);
        console.error('\\nPlease check:');
        console.error('1. PostgreSQL connection string in .env file');
        console.error('2. Database is accessible');
        console.error('3. You have proper permissions\\n');
        process.exit(1);
    }
}

migrateUserTable();
