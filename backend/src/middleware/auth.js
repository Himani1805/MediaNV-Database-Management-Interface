import 'dotenv/config';

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.API_KEY;

    if (!apiKey || apiKey !== validKey) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or missing API Key."
        });
    }

    next();
};

export default authMiddleware;