import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true          // Fast lookups
    },
    expiresAt: {             // Consistent naming
        type: Date,
        required: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    replacedBy: {            // Lowercase 'r'
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Schema.Types not Types
        ref: "User",         // Match model name exactly
        required: true,
        index: true
    }
}, { 
    timestamps: true         // Adds createdAt + updatedAt
});
// ✅ Add this: Auto-delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;