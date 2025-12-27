import User from "../models/userModel.js";

const userRepository = {

    create: async (userData) => {
        return await User.create(userData);
    },

    findByEmail: async (email, options = {}) => {
        const query = User.findOne({ email });
        
        if (options.includePassword) {
            query.select("+password");
        }
        
        return await query;
    },

    findById: async (id) => {
        return await User.findById(id);
    },

    // Check if pupil is in ANY classroom
    hasClassroom: async (userId) => {
        const user = await User.findById(userId);
        return !!user?.classroomId;
    },

    // Check if pupil is in SPECIFIC classroom
    isInClassroom: async (userId, classroomId) => {
        const user = await User.findById(userId);
        return user?.classroomId?.toString() === classroomId.toString();
    },

    // Get all pupils in a classroom
    findPupilsByClassroom: async (classroomId) => {
        return await User.find({ 
            classroomId, 
            role: "pupil" 
        });
    },

    // Add pupil to classroom
    updateClassroom: async (userId, classroomId) => {
        return await User.findByIdAndUpdate(
            userId,
            { classroomId },
            { new: true }
        );
    },

    // Remove pupil from classroom
    removeFromClassroom: async (userId) => {
        return await User.findByIdAndUpdate(
            userId,
            { classroomId: null },
            { new: true }
        );
    }
};

export default userRepository;