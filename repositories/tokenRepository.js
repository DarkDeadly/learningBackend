
import RefreshToken from "../models/refreshToken-Model.js";

const tokenRepository = {

    create: async (tokenData) => {
        const token = await RefreshToken.create(tokenData);
        return token;
    },

    findByToken: async (hashedToken) => {
        return await RefreshToken.findOne({ token: hashedToken });
    },

    revokeToken: async (hashedToken, replacedBy = null) => {
        return await RefreshToken.findOneAndUpdate(
            { token: hashedToken },
            { 
                isRevoked: true, 
                replacedBy: replacedBy 
            },
            { new: true }  // Return updated document
        );
    },

    revokeAllUserTokens: async (userId) => {
        return await RefreshToken.updateMany(
            { userId: userId },
            { isRevoked: true }
        );
    }
};

export default tokenRepository;