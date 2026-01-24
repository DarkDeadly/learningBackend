import classRepository from "../repositories/classRepository.js";
import pointRepository from "../repositories/pointRepository.js";
import purchaseRepository from "../repositories/purchaseRepository.js";
import rewardRepository from "../repositories/rewardRepository.js";
import userRepository from "../repositories/userRepository.js";
import mongoose from 'mongoose';

const verifyClassroomOwnership = async (teacherId, classroomId) => {
    const classroom = await classRepository.findById(classroomId);
    if (!classroom) {
        throw new Error("Classroom not found");
    }
    if (classroom.teacherId.toString() !== teacherId.toString()) {
        throw new Error("Not your classroom");
    }
    return classroom;
};

const verifyRewardOwnership = async (teacherId, rewardId) => {
    const reward = await rewardRepository.findById(rewardId);
    if (!reward) {
        throw new Error("Reward not found");
    }
    if (reward.teacherId.toString() !== teacherId.toString()) {
        throw new Error("Not your reward");
    }
    return reward;
};

const rewardService = {

    create: async (teacherId, classroomId, name , cost , expiresAt) => {
        // Step 1: Teacher Verification
         await verifyClassroomOwnership(teacherId, classroomId) 

        // Step 2: Validate expiresAt is future
        const expireDateValidity = expiresAt > new Date()
        if (!expireDateValidity) {throw new Error("Expiration date must be in the future")}
        // Step 3: Create reward
        const result = await rewardRepository.create({
            name , 
            cost,
            classroomId,
            teacherId,
            expiresAt
        })
        // Step 4: Return result
        return {success : true , reward : result}
    },

    getByClassroom: async ( classroomId) => {
        const result = await rewardRepository.findByClassroom(classroomId , true)
        return {reward : result}
    },
    
    getAvailableForPupil: async (pupilId) => {
    // 1. Get Pupil data for balance check
    const pupil = await userRepository.findById(pupilId);
    if (!pupil || !pupil.classroomId) {
        throw new Error("Pupil not enrolled in a classroom");
    }

    // 2. Use the Aggregation we just built
    const rewards = await rewardRepository.getPupilRewardsWithStatus(
        pupil.classroomId, 
        pupilId
    );

    // 3. Add the 'canAfford' logic in a simple map
    const enhancedRewards = rewards.map(reward => ({
        ...reward,
        canAfford: pupil.pointBalance >= reward.cost
    }));

    return { 
        rewards: enhancedRewards, 
        currentPoints: pupil.pointBalance 
    };
},
    update: async (teacherId, rewardId, updateData) => {
        // Step 1: Verify reward exists
        await verifyRewardOwnership(teacherId , rewardId)
        // Step 3: Validate expiresAt if provided
        if (updateData.expiresAt){ //check if the teacher  updated the expired Date
            const expiresAt = new Date(updateData.expiresAt); //setting it up 
        if (isNaN(expiresAt.getTime()) || expiresAt <= new Date()) { //if the updated expireAt is less than the current date now 
            throw new Error("expiresAt must be a valid future date");
        }
        }
        // Step 4: Filter allowed fields
        const allowedFields = ["name", "cost", "expiresAt"];
        const filteredUpdate = {};

        for (const field of allowedFields) { //if field is either one the allowedFields values
            if (updateData[field] !== undefined) { //updateData[field] not undefined
                filteredUpdate[field] = updateData[field];
        }
    }

        if (Object.keys(filteredUpdate).length === 0) {
            throw new Error("No valid fields to update");
        }

        // Step 5: Update and return
        const updatedReward = await rewardRepository.update(
            rewardId, filteredUpdate);

    return {success : true , reward: updatedReward};
},

    delete: async (teacherId, rewardId) => {
       await verifyRewardOwnership(teacherId , rewardId)
        await rewardRepository.delete(rewardId)
        return {success : true};

    },
purchase: async (pupilId, rewardId) => {
    // 1. Create the session
    const session = await mongoose.startSession();
    
    try {
        let result;
        // 2. Execute the transaction
        await session.withTransaction(async () => {
            
            // 3. Get the reward (using the session ticket)
            const reward = await rewardRepository.findById(rewardId, session);
            if (!reward) throw new Error("Reward not found");
            if (reward.expiresAt <= new Date()) throw new Error("Reward has expired");

            // 4. THE ATOMIC STEP
            // We try to deduct points. If the user doesn't have enough, 
            // the DB returns null and we stop immediately.
            const updatedUser = await userRepository.deductPointsAtomic(pupilId, reward.cost, session);
            
            if (!updatedUser) {
                throw new Error("Insufficient points or user not found");
            }

            // 5. Audit Trail (Always use arrays [] for create + session)
            await purchaseRepository.create([{
                rewardId,
                rewardName: reward.name,
                pupilId,
                classroomId: reward.classroomId,
                pointsSpent: reward.cost
            }], session);

            // This ensures the student's "Point History" matches their "Purchases"
            await pointRepository.create([{
                pupilId,
                classroomId: reward.classroomId,
                amount: -reward.cost,
                type: "spent",
                reason: `شراء مكافأة: ${reward.name}`
            }], session);

            result = { 
                success: true, 
                newBalance: updatedUser.pointBalance 
            };
        });

        return result;

    } catch (error) {
        // If anything failed inside withTransaction, 
        // MongoDB automatically rolls back all changes.
        throw error; 
    } finally {
        // Always close the session
        await session.endSession();
    }
},

};

export default rewardService;