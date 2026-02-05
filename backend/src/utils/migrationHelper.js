import { exec } from 'child_process';

/**
 * Executes a full migration using pg_dump and psql
 * @param {string} sourceDb - The database to copy from
 * @param {string} targetDb - The database to copy into
 * @returns {Promise}
 */
export const migrateData = (sourceDb, targetDb) => {
    return new Promise((resolve, reject) => {
        // Construct the shell command
        // -h: host, -U: user
        const cmd = `pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} "${sourceDb}" | psql -h ${process.env.DB_HOST} -U ${process.env.DB_USER} "${targetDb}"`;

        // Set PGPASSWORD in the child process environment to avoid manual entry
        const env = { 
            ...process.env, 
            PGPASSWORD: process.env.DB_PASSWORD 
        };

        console.log(`Starting migration: ${sourceDb} -> ${targetDb}...`);

        exec(cmd, { env }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Migration Error: ${stderr}`);
                return reject(new Error(stderr || error.message));
            }
            console.log(`Migration logic finished for ${targetDb}`);
            resolve(stdout);
        });
    });
};