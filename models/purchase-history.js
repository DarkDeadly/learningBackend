import mongoose from "mongoose";

const pointTransactionSchema = new mongoose.Schema({
    pupilId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true
    },
    amount: {
        type: Number,
        required: true
        // Positive = earned, Negative = spent
    },
    type: {
        type: String,
        enum: ["earned", "spent", "bonus", "penalty"],
        required: true
    },
    reason: {
        type: String,
        required: true
        
    },
    givenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
        // Teacher who gave points (null if spent on reward)
    }
}, { 
    timestamps: true 
});

const PointTransaction = mongoose.model("PointTransaction", pointTransactionSchema);

export default PointTransaction;