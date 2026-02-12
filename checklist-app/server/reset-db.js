import { query } from './db.js';

async function resetDatabase() {
    try {
        console.log('⚠️  WARNING: This will delete ALL data from the database!');
        console.log('🔄 Resetting database...\n');

        // Drop all tables
        await query(`
            DROP TABLE IF EXISTS list_ratings CASCADE;
            DROP TABLE IF EXISTS custom_progress CASCADE;
            DROP TABLE IF EXISTS custom_resources CASCADE;
            DROP TABLE IF EXISTS custom_topics CASCADE;
            DROP TABLE IF EXISTS custom_sections CASCADE;
            DROP TABLE IF EXISTS custom_lists CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
        `);

        console.log('✅ All tables dropped successfully!');
        console.log('\n📝 Database is now empty.');
        console.log('💡 Run "npm run init-db" to recreate the schema.\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Reset failed:', error.message);
        console.error('\nPlease check:');
        console.error('1. PostgreSQL connection string in .env file');
        console.error('2. Database is accessible');
        console.error('3. You have proper permissions\n');
        process.exit(1);
    }
}

resetDatabase();
