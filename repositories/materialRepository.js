import MaterialModel from "../models/material-model.js";

const materialRepository = {

    // Create material
    create: async (materialData) => {
        return await MaterialModel.create(materialData)
    },

    // Find by ID
    findById: async (materialId) => {
        return await MaterialModel.findById(materialId)
    },

    // Find all materials for a course
    findByCourse: async (courseId) => {
        // Your code here
        return await MaterialModel.find({courseId})
        .sort({createdAt : -1})
        // Hint: sort by createdAt
    },

    // Delete single material
    delete: async (materialId) => {
        return await MaterialModel.findByIdAndDelete(materialId)
        // Your code here
    },

    // Delete all materials for a course (when course is deleted)
    deleteByCourse: async (courseId) => {
        // Your code here
        return await MaterialModel.deleteMany({courseId})
        // Hint: deleteMany
    }
};

export default materialRepository;