import pool from '../config/db.js';
import { migrateData } from '../utils/migrationHelper.js';

const DB_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * @desc    List all non-template databases
 * @route   GET /api/databases
 */
export const getAllDatabases = async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT datname FROM pg_database WHERE datistemplate = false"
        );
        
        const databases = result.rows.map(row => row.datname);
        
        res.status(200).json({
            success: true,
            count: databases.length,
            databases
        });
    } catch (error) {
        // Pass errors to the central error middleware
        // Interview Tip: This keeps our controller clean and DRY (Don't Repeat Yourself)
        next(error); 
    }
};

/**
 * @desc    Create a new PostgreSQL database
 * @route   POST /api/databases
 */
export const createNewDatabase = async (req, res, next) => {
    const { dbName } = req.body;

    // 1. Validation
    if (!dbName || !DB_NAME_REGEX.test(dbName)) {
        return res.status(400).json({
            success: false,
            message: "Invalid database name. Must start with a letter/underscore and contain only alphanumeric characters."
        });
    }

    try {
        // 2. Execution
        await pool.query(`CREATE DATABASE "${dbName}"`);

        res.status(201).json({
            success: true,
            message: `Database "${dbName}" created successfully.`
        });
    } catch (error) {
        // 3. Handle specific known errors (like duplicates)
        if (error.code === '42P04') {
            return res.status(409).json({
                success: false,
                message: "Database already exists."
            });
        }
        
        // Pass unexpected errors to global handler
        next(error);
    }
};

/**
 * @desc    Verify if a database exists
 * @route   POST /api/databases/verify
 */
export const checkDatabaseExists = async (req, res, next) => {
    const { dbName } = req.body;

    if (!dbName) {
        return res.status(400).json({ success: false, message: "Database name is required." });
    }

    try {
        const result = await pool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1", 
            [dbName]
        );

        if (result.rowCount > 0) {
            return res.status(200).json({
                success: true,
                exists: true,
                message: `Database "${dbName}" found.`
            });
        } else {
            return res.status(404).json({
                success: false,
                exists: false,
                message: "Database not found."
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Handle full database migration
 * @route   POST /api/databases/migrate
 */
export const handleMigration = async (req, res, next) => {
    const { sourceDbName, targetDbName } = req.body;

    if (!sourceDbName || !targetDbName) {
        return res.status(400).json({ success: false, message: "Both source and target database names are required." });
    }

    try {
        // 1. Verify existence
        const checkQuery = "SELECT datname FROM pg_database WHERE datname IN ($1, $2)";
        const result = await pool.query(checkQuery, [sourceDbName, targetDbName]);

        if (result.rowCount < 2) {
            return res.status(404).json({
                success: false,
                message: "One or both databases do not exist."
            });
        }

        // 2. Perform Migration
        await migrateData(sourceDbName, targetDbName);

        res.status(200).json({
            success: true,
            message: `Migration from "${sourceDbName}" to "${targetDbName}" completed successfully.`
        });

    } catch (error) {
        next(error);
    }
};
