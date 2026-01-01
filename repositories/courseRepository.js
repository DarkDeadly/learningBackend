// repositories/courseRepository.js

import courseModel from "../models/course-model.js";

const courseRepository = {
    
    create: async (courseData) => {
       return await courseModel.create(courseData)
    },

    // Find by ID
    findById: async (courseId) => {
        return await courseModel.findById(courseId)
    },
    

    // Find all courses in a classroom
    findByClassroom: async (classroomId) => {
        // Your code here
        return await courseModel.find({classroomId , isActive : true})
        .populate("teacherId" , "fullname" , "")
        .sort({createdAt : -1})
        // Hint: filter by isActive: true
        // Hint: sort by createdAt descending
    },

    // Update course
    update: async (courseId, updateData) => {
        // Your code here
        return await courseModel.
        findByIdAndUpdate(courseId , updateData ,{ new: true, runValidators: true }
)
    },

    // Delete course
    delete: async (courseId) => {
        // Your code here
        return  await courseModel.findByIdAndDelete(courseId)
    }
};

export default courseRepository;