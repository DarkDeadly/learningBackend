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

   findById: async (id, session = null) => {
        return await User.findById(id).session(session);
    },

    // OPTIMIZATION: Instead of fetching the whole user, just use .exists()
    // This is faster because Mongo doesn't have to send the whole document over the network.
    hasClassroom: async (userId) => {
        const user = await User.exists({ _id: userId, classroomId: { $ne: null } });
        return !!user;
    },

    // Check if pupil is in SPECIFIC classroom
  isInClassroom: async (userId, classroomId) => {
    // We check for a document that has THIS ID and THIS classroomId
    const exists = await User.exists({ 
        _id: userId, 
        classroomId: classroomId 
    });
    return !!exists;
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
    },
   deductPointsAtomic: async (userId, cost, session = null) => {
        return await User.findOneAndUpdate(
            { 
                _id: userId, 
                pointBalance: { $gte: cost } // The Security Check
            },
            { $inc: { pointBalance: -cost } },
            { session, new: true, runValidators: true }
        );
    },

    // Keep the general updatePoints for "Giving" points (where balance check doesn't matter)
    updatePoints: async (userId, point, session = null) => {
        return await User.findByIdAndUpdate(
            userId, 
            { $inc: { pointBalance: point } },
            { session, new: true }
        );
    }
};

export default userRepository;