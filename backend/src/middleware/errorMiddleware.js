import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, '../logs/activity.log');

const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    const errorLog = `[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${err.message}\nStack: ${err.stack}\n\n`;

    // Append error stack to log file
    fs.appendFile(logFilePath, errorLog, (fileErr) => {
        if (fileErr) console.error("Could not write error to log file", fileErr);
    });

    console.error(`Error: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        // Only show stack trace in development mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorMiddleware;