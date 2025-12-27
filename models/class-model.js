import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Classroom name is required"],
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    pin: {
        type: String,
        required: [true, "PIN is required"]
        // Store HASHED!
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;