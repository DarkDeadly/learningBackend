import mongoose from "mongoose";

const rewardPurchaseSchema = new mongoose.Schema({
    rewardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reward",
        required: true
    },
    pupilId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true
    },
    pointsSpent: {
        type: Number,
        required: true
    }
}, { 
    timestamps: true 
});

// ONE purchase per pupil per reward - MongoDB enforces this!
rewardPurchaseSchema.index(
    { rewardId: 1, pupilId: 1 },
    { unique: true }
);

const RewardPurchase = mongoose.model("RewardPurchase", rewardPurchaseSchema);

export default RewardPurchase;