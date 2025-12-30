import Reward from "../models/reward-model.js";

const rewardRepository = {
    
    // CREATE - Add new reward to database
    create: async (rewardData) => {
        return await Reward.create(rewardData)
    },
    
    // READ (single) - Get one reward by ID
    findById: async (rewardId) => {
        return await Reward.findById(rewardId)
        
    },
    
    // READ (multiple) - Get all rewards for a classroom
    findByClassroom: async (classroomId, includeExpired = false) => {
        const query = { classroomId };     
          if (!includeExpired) {
            query.expiresAt = { $gt: new Date() };
    }
        return await Reward.find(query).sort({ createdAt: -1 });
    },   
    // UPDATE - Modify an existing reward
    update: async (rewardId, updateData) => {
        return await Reward.findByIdAndUpdate(rewardId , updateData , {new : true , runValidators: true})
       
    },
    
    // DELETE - Remove a reward
    delete: async (rewardId) => {
        return await Reward.findByIdAndDelete(rewardId)    
    }
    
};

export default rewardRepository