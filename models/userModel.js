import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Full name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    role: {
        type: String,
        enum: {
            values: ["pupil", "teacher", "admin"],
            message: "{VALUE} is not a valid role"
        },
        default: "pupil"
    },
    pointBalance: {
        type: Number,
        default: 0
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        default: null
        // null for teachers/admin
        // set when pupil joins a class
    }
}, { 
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;