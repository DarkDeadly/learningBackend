import Reward from "../models/reward-model.js";

const rewardRepository = {
    create: async (rewardData, session = null) => {
        return await Reward.create(
            Array.isArray(rewardData) ? rewardData : [rewardData], 
            { session }
        );
    },
    
    // Added session support
    findById: async (rewardId, session = null) => {
        return await Reward.findById(rewardId).session(session);
    },
    
    findByClassroom: async (classroomId, includeExpired = false) => {
        const query = { classroomId };     
        if (!includeExpired) {
            query.expiresAt = { $gt: new Date() };
        }
        // Added .lean() for portfolio performance
        return await Reward.find(query).sort({ createdAt: -1 }).lean();
    },   

    update: async (rewardId, updateData, session = null) => {
        return await Reward.findByIdAndUpdate(
            rewardId, 
            updateData, 
            { new: true, runValidators: true, session }
        );
    },
    
    delete: async (rewardId, session = null) => {
        return await Reward.findByIdAndDelete(rewardId).session(session);    
    },
    getPupilRewardsWithStatus: async (classroomId, pupilId) => {
        return await Reward.aggregate([
            {
                $match: {
                    classroomId: new mongoose.Types.ObjectId(classroomId),
                    expiresAt: { $gt: new Date() }
                }
            },
            {
                $lookup: {
                    from: "rewardpurchases", 
                    let: { rewardId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$rewardId", "$$rewardId"] },
                                        { $eq: ["$pupilId", new mongoose.Types.ObjectId(pupilId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "purchaseInfo"
                }
            },
            {
                $project: {
                    name: 1,
                    cost: 1,
                    expiresAt: 1,
                    alreadyPurchased: { $gt: [{ $size: "$purchaseInfo" }, 0] }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
    }
};

export default rewardRepository