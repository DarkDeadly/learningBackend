import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    textContent: {
        type: String,
        default: null
    },
    pdf: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
        originalName: { type: String, default: null }
    },
    audio: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
        originalName: { type: String, default: null }
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
    }
}, {
    timestamps: true
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;