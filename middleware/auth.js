import jwt from "jsonwebtoken"

const auth = async (req , res , next ) => {
     const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({message : "Unauthorized: Invalid token"})
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({message : "Unauthorized: Invalid token"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
             return res.status(401).json({message : "Unauthorized: Invalid token"})
        }
        if (error instanceof jwt.JsonWebTokenError) {
             return res.status(401).json({message : "Unauthorized: Invalid token"})
        }
         return res.status(500).json({message : "Server Error"})
    }
}

export default auth