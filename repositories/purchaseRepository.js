import RewardPurchase from "../models/reward-purchase.js";

const purchaseRepository = {
    // UPDATED: Added session parameter
    create: async (purchaseData, session = null) => {
        // Mongoose requires an array for create when using sessions
        return await RewardPurchase.create(
            Array.isArray(purchaseData) ? purchaseData : [purchaseData], 
            { session }
        );
    },
    
    // UPDATED: Added session to findOne
    hasPurchased: async (pupilId, rewardId, session = null) => { 
        const purchase = await RewardPurchase.findOne({
            pupilId: pupilId,
            rewardId: rewardId
        }).session(session); // Tell Mongo to check within the transaction
        
        return !!purchase;
    },
    
    findByPupil: async (pupilId) => {
        return await RewardPurchase
            .find({ pupilId: pupilId })
            .sort({ createdAt: -1 })
            .lean(); // Senior Tip: Use .lean() for faster read-only history
    }
};

export default purchaseRepository