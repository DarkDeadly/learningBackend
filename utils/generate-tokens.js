import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateTokens = {

    accessToken: (userId , role)  => {
        const secret = process.env.JWT_SECRET;
        
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }

        return jwt.sign({ id: userId , role : role}, secret, { expiresIn: "15m" });
    },

    refreshToken: () => {
        return crypto.randomBytes(64).toString("hex");
    }
};

export default generateTokens;