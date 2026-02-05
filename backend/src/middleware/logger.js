import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, '../logs/activity.log');

// Ensure the logs directory exists
if (!fs.existsSync(path.join(__dirname, '../logs'))) {
    fs.mkdirSync(path.join(__dirname, '../logs'));
}

const activityLogger = (req, res, next) => {
    // Only log POST requests as per requirements
    if (req.method === 'POST') {
        const { password, ...safeBody } = req.body; // Redact password if present
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            endpoint: req.originalUrl,
            method: req.method,
            payload: safeBody,
            ip: req.ip
        };

        const logString = `[INFO] ${JSON.stringify(logEntry)}\n`;
        
        fs.appendFile(logFilePath, logString, (err) => {
            if (err) console.error("Failed to write to activity.log", err);
        });
    }
    next();
};

// Helper for logging errors explicitly (can be called from controllers)
export const logError = (message, details) => {
    const errorEntry = `[ERROR] ${new Date().toISOString()} - ${message}: ${JSON.stringify(details)}\n`;
    fs.appendFile(logFilePath, errorEntry, () => {});
};

export default activityLogger;