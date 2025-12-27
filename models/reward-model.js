import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Reward name is required"],
        trim: true,
        index: true
    },
    cost: {
        type: Number,
        required: [true, "Cost is required"],
        min: [1, "Cost must be at least 1 point"]
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
        index: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { 
    timestamps: true 
});

// Auto-delete expired rewards
rewardSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;