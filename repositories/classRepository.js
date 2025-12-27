import Classroom from "../models/class-model.js"

const classRepository = {
    create : async ( classData ) => {
       return await Classroom.create(classData)
        
    },
    findById : async(classId) => {
        return await Classroom.findById(classId)
    },
    findByTeacherId : async (teacherId) => {
        return await Classroom.find({teacherId})
        
    },
    findByIdWithTeacher : async(id) => {
         return await Classroom.findById(id).populate("teacherId", "fullname email")
        
    },
    update: async (classroomId, updateData) => {
        return await Classroom.findByIdAndUpdate(
            classroomId,
            updateData,
            { new: true }  // Return updated document
        );
    },

    delete: async (classroomId) => {
        return await Classroom.findByIdAndDelete(classroomId);
    }
}

export default classRepository