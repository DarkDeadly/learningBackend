import mongoose from "mongoose";
import tokenRepository from "../repositories/tokenRepository.js";
import userRepository from "../repositories/userRepository.js";
import { getExpirationDate } from "../utils/expirationDate.js";
import generateTokens from "../utils/generate-tokens.js";
import hashToken from "../utils/hashToken.js";
import passwordUtils from "../utils/password-helper.js";

const authService = {

    register: async (fullname, email, password) => {
        // Check if email exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("Email already registered");
        }

        // Hash password
        const hashedPassword = await passwordUtils.hash(password);
        //Getting the session started 
        const session = await mongoose.startSession()
        session.startTransaction();
        try {
          // Create user
            const user = await userRepository.create(
                [{ fullname, email, password: hashedPassword }], 
                { session }
        );
            const newUser = user[0]; // Mongoose returns an array when using sessions  
            const accessToken = generateTokens.accessToken(newUser._id  , newUser.role);
            const refreshToken = generateTokens.refreshToken();
            const hashedRefreshToken = hashToken(refreshToken);
            await tokenRepository.create(
                [{
                    token: hashedRefreshToken,
                    userId: newUser._id,
                    expiresAt: getExpirationDate(15)
                }], 
                { session }
        );
        // 5. THE COMMIT: If we reached here, save everything forever
        await session.commitTransaction();
        return { user: newUser, accessToken, refreshToken };
        } catch (error) {
            // 6. THE ROLLBACK: If anything failed, undo everything
            await session.abortTransaction();
            throw error; 
        }finally {
            session.endSession();
        }
    },

    login: async (email, password) => {
        // Find user by email (WITH password!)
        const user = await userRepository.findByEmail(email, { includePassword: true });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Compare passwords
        const passwordMatch = await passwordUtils.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Invalid credentials");  // Same message!
        }

        // Generate tokens
        const accessToken = generateTokens.accessToken(user._id , user.role);
        const refreshToken = generateTokens.refreshToken();

        // Save refresh token (hashed)
        const hashedRefreshToken = hashToken(refreshToken);
        await tokenRepository.create({
            token: hashedRefreshToken,
            userId: user._id,
            expiresAt: getExpirationDate(15)
        });

        return { user, accessToken, refreshToken };
    },

    refresh: async (token) => {
        // Step 1: Hash incoming token
        const hashedToken = hashToken(token);

        // Step 2: Find in database
        const storedToken = await tokenRepository.findByToken(hashedToken);
        if (!storedToken) {
            throw new Error("Invalid or expired token");
        }

        // Step 3: Check if REVOKED (theft detection!)
        if (storedToken.isRevoked) {
            console.warn(`[SECURITY] Revoked token reuse detected! userId: ${storedToken.userId}`);
            await tokenRepository.revokeAllUserTokens(storedToken.userId);
            throw new Error("Invalid or expired token");
        }

        // Step 4: Check if EXPIRED
        if (storedToken.expiresAt < new Date()) {
            throw new Error("Invalid or expired token");
        }

        // Step 5: Find the user
        const user = await userRepository.findById(storedToken.userId);
        if (!user) {
            throw new Error("Invalid or expired token");
        }

        // Step 6: Generate NEW tokens
        const newAccessToken = generateTokens.accessToken(user._id , user.role);
        const newRefreshToken = generateTokens.refreshToken();
        const hashedNewRefreshToken = hashToken(newRefreshToken);

        // Step 7: Revoke old token (with reference to new one)
        await tokenRepository.revokeToken(hashedToken, hashedNewRefreshToken);

        // Step 8: Save new token
        await tokenRepository.create({
            token: hashedNewRefreshToken,
            userId: user._id,
            expiresAt: getExpirationDate(15)
        });

        // Step 9: Return plain tokens (for client)
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },
    logout: async (token) => {
        const hashedToken = hashToken(token)
        await tokenRepository.revokeToken(hashedToken)
        return { Success: true }
    },
    logoutAll: async (userId) => {
        await tokenRepository.revokeAllUserTokens(userId)
        return { Success: true }
    },
    profile : async(userId) => {
       return userRepository.findById(userId)
    },
    

};

export default authService;