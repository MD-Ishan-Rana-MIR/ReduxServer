const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from Authorization header
const verifyToken = (req, res, next) => {
    try {
        // Get token from headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Bearer <token>

        // Verify token
        const decoded = jwt.verify(token, process.env.JWTKEY);
        console.log(decoded);
        const id = decoded.id;
        req.headers.id = id



        // Attach decoded info to request object


        next(); // call next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
