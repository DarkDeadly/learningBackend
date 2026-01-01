import mongoose from "mongoose"


const MaterialSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: null  // In seconds
    },
    fileSize: {
        type: Number,
        default: null
    }
}, { timestamps: true });

const MaterialModel = mongoose.model("Material" , MaterialSchema)
export default MaterialModel