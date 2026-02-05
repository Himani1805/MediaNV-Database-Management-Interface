import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dbRoutes from './routes/dbRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
// Adds security headers to prevent common vulnerabilities
app.use(helmet());

// Handles Cross-Origin Resource Sharing for frontend integration
app.use(cors());

// Built-in body parser for JSON
app.use(express.json());

// --- Routes ---
// Mount Database Routes
app.use('/api/databases', dbRoutes);

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'PostgreSQL Management API is healthy'
    });
});

// GLOBAL ERROR HANDLER (MUST be last)
app.use(errorMiddleware);

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    console.log('Routes mounted: /api/databases');
});

// Graceful error handling for unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error(`Fatal Error: ${err.message}`);
    process.exit(1);
});