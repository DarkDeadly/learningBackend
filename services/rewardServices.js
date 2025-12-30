import classRepository from "../repositories/classRepository.js";
import pointRepository from "../repositories/pointRepository.js";
import purchaseRepository from "../repositories/purchaseRepository.js";
import rewardRepository from "../repositories/rewardRepository.js";
import userRepository from "../repositories/userRepository.js";

const rewardService = {

    create: async (teacherId, classroomId, name , cost , expiresAt) => {
        // Step 1: Verify classroom exists
        const classCheck = await classRepository.findById(classroomId)
        if(!classCheck){throw new Error("Resource not found")}
        // Step 2: Verify teacher owns classroom
        const teacherOwnerShip = classCheck.teacherId.toString() === teacherId.toString()
        if(!teacherOwnerShip){throw new Error("Resource not found")}
        // Step 3: Validate expiresAt is future
        const expireDateValidity = expiresAt > new Date()
        if (!expireDateValidity) {throw new Error("Expiration date must be in the future")}
        // Step 4: Create reward
        const result = await rewardRepository.create({
            name , 
            cost,
            classroomId,
            teacherId,
            expiresAt
        })
        // Step 5: Return result
        return {success : true , reward : result}
    },

    getByClassroom: async (teacherId, classroomId) => {
        // Step 1: Verify classroom exists
         const classCheck = await classRepository.findById(classroomId)
        if(!classCheck){throw new Error("Resource not found")}
        // Step 2: Verify teacher owns classroom
        const teacherOwnerShip = classCheck.teacherId.toString() === teacherId.toString()
        if(!teacherOwnerShip){throw new Error("Resource not found")}
        const result = await rewardRepository.findByClassroom(classroomId , true)
        return {reward : result}
    },
    
    getAvailableForPupil: async (pupilId ) => {
        //Step 1: Check if pupil belong in classroom 
        const pupil = await userRepository.findById(pupilId)
        if(!pupil){throw new Error("Resource not found")}
        //Step 2 : Get classroomId
        const pupilClassroom = pupil.classroomId
        if(!pupilClassroom){throw new Error("Not enrolled in any classroom")}
        //Step 3 : Get available rewards 
        const availableRewards = await rewardRepository.findByClassroom(pupilClassroom , false)
        //Step 4: Get pupil's purchase history
        const purchases = await purchaseRepository.findByPupil(pupilId)
        const purchasedRewardIds = purchases.map(p => p.rewardId.toString());
        // Step 4: Enhance each reward with affordability and purchase status
        const enhancedRewardFilter = availableRewards.map(reward => ({
             _id: reward._id,
            name: reward.name,
            cost: reward.cost,
            expiresAt: reward.expiresAt,
            canAfford : pupil.pointBalance >= reward.cost,
            alreadyPurchased : purchasedRewardIds.includes(reward._id.toString())
        }))
        return {rewards : enhancedRewardFilter , currentPoints : pupil.pointBalance}
    },

    update: async (teacherId, rewardId, updateData) => {
        // Step 1: Verify reward exists
        const rewardValidity = await rewardRepository.findById(rewardId)
        if (!rewardValidity) { throw new Error("Resource not found") }
        // Step 2: Verify teacher owns reward
        const teacherOwnership = rewardValidity.teacherId.toString() === teacherId.toString()
        if(!teacherOwnership) {throw new Error("Resource not found")}
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
        const rewardValidity = await rewardRepository.findById(rewardId)
        if (!rewardValidity) { throw new Error("Resource not found") }
        // Step 2: Verify teacher owns reward
        const teacherOwnership = rewardValidity.teacherId.toString() === teacherId.toString()
        if(!teacherOwnership) {throw new Error("Resource not found")}   
        // Step 3: Delete
        await rewardRepository.delete(rewardId)
        return {success : true};

    },
    purchase: async (pupilId, rewardId) => {
    // Step 1: Get pupil
    const pupil = await userRepository.findById(pupilId);
    if (!pupil) {
        throw new Error("Resource not found");
    }
    
    // Step 2: Check pupil is enrolled
    if (!pupil.classroomId) {
        throw new Error("Not enrolled in any classroom");
    }
    
    // Step 3: Get reward
    const reward = await rewardRepository.findById(rewardId);
    if (!reward) {
        throw new Error("Resource not found");
    }
    
    // Step 4: Check reward is in pupil's classroom
    if (reward.classroomId.toString() !== pupil.classroomId.toString()) {
        throw new Error("Reward not in your classroom");
    }
    
    // Step 5: Check reward is not expired
    if (reward.expiresAt <= new Date()) {
        throw new Error("Reward has expired");
    }
    
    // Step 6: Check not already purchased
    const alreadyPurchased = await purchaseRepository.hasPurchased(pupilId, rewardId);
    if (alreadyPurchased) {
        throw new Error("Already purchased this reward");
    }
    
    // Step 7: Check sufficient points
    if (pupil.pointBalance < reward.cost) {
        throw new Error("Insufficient points");
    }
    
    // ═══════════════════════════════════════════
    // All validations passed. Execute purchase.
    // ═══════════════════════════════════════════
    
    // Step 8: Create purchase record
    const purchase = await purchaseRepository.create({
        rewardId: rewardId,
        rewardName: reward.name,
        pupilId: pupilId,
        classroomId: pupil.classroomId,
        pointsSpent: reward.cost
    });
    
    // Step 9: Deduct points from pupil
    const updatedPupil = await userRepository.updatePoints(pupilId, -reward.cost);
    
    // Step 10: Create point transaction record
    await pointRepository.create({
        pupilId: pupilId,
        classroomId: pupil.classroomId,
        amount: -reward.cost,
        type: "spent",
        reason: `شراء مكافأة: ${reward.name}`,
        givenBy: null
    });
    
    // Return result
    return {
        success: true,
        purchase: {
            id: purchase._id,
            rewardName: reward.name,
            pointsSpent: reward.cost,
            purchasedAt: purchase.createdAt
        },
        newBalance: updatedPupil.pointBalance
    };
}

};

export default rewardService;