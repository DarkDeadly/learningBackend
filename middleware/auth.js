import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    //as all the methods u are using doesnt return a promise you dont need async await
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized: No token provided" 
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Log for debugging — never send to client
        console.error("Auth error:", error.name, error.message);
        
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ 
                success: false,
                message: "Token expired",
                code: "TOKEN_EXPIRED"  // Frontend can trigger refresh
            });
        }
        
        return res.status(401).json({ 
            success: false,
            message: "Invalid token" 
        });
    }
};

export default auth