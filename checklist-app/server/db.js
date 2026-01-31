import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.POSTGRESQL_URI,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
    console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('✗ Unexpected database error:', err);
    process.exit(-1);
});

// Query helper function
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        // Only log slow queries (> 1000ms)
        if (duration > 1000) {
            console.log(`⚠️  Slow query: ${duration}ms, ${res.rowCount} rows`);
        }
        return res;
    } catch (error) {
        console.error('❌ Database query error:', error.message);
        throw error;
    }
};

// Transaction helper
export const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export default pool;
