import express from 'express';
import { createNewDatabase, checkDatabaseExists, handleMigration, getAllDatabases } from '../controllers/dbController.js';

// Import Middlewares
import authMiddleware from '../middleware/auth.js';
import activityLogger from '../middleware/logger.js';

const router = express.Router();

// Apply Auth and Logger to all routes in this router
router.use(authMiddleware);
router.use(activityLogger);

// GET /api/databases - List all DBs
router.get('/', getAllDatabases);

// Path: /api/databases/
router.post('/', createNewDatabase);

// POST /api/databases/verify - Check if a DB exists
router.post('/verify', checkDatabaseExists);

// POST /api/databases/migrate - Handle full migration
router.post('/migrate', handleMigration);

export default router;