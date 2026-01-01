import mongoose from "mongoose"


const courseSchema = new mongoose.Schema({
    classroomId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Classroom",
        required : true ,
        index : true 
    },
    title : {
        type : String , 
        required : true , 
        index : true
    },
    description : {
        type : String ,  
        default : null 
    },
    isActive : {
        type : Boolean,
        default : true
    },
    teacherId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    }
},{timestamps: true})

const courseModel = mongoose.model("Course" , courseSchema)
export default courseModel