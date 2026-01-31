import pool, { query } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    try {
        console.log('🔄 Initializing database...\n');

        // Use the complete schema file
        const sqlPath = path.join(__dirname, 'migrations', 'complete-schema.sql');

        console.log(`📄 Running complete database schema initialization\n`);

        // Check if file exists
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Schema file not found: ${sqlPath}`);
        }

        // Read the SQL file
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the SQL
        await query(sql);

        console.log('\n✅ Database initialized successfully!');
        console.log('✅ All tables, indexes, and triggers created');
        console.log('\n📋 Created tables:');
        console.log('   • users');
        console.log('   • custom_lists');
        console.log('   • custom_sections');
        console.log('   • custom_topics');
        console.log('   • custom_resources');
        console.log('   • custom_progress');
        console.log('   • list_ratings');
        console.log('\nYou can now start the server with: npm run server\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Initialization failed:', error.message);
        console.error('\nPlease check:');
        console.error('1. PostgreSQL connection string in .env file');
        console.error('2. Database is accessible');
        console.error('3. You have proper permissions\n');
        process.exit(1);
    }
}

initDatabase();
