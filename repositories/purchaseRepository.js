import RewardPurchase from "../models/reward-purchase.js";

const purchaseRepository = {
    
    // Record a new purchase
    create: async (purchaseData) => {
        return await RewardPurchase.create(purchaseData)
    },
    
    // Check if pupil already bought this specific reward
    hasPurchased: async (pupilId, rewardId) => { 
    const purchase = await RewardPurchase.findOne({
        pupilId: pupilId,
        rewardId: rewardId
    });
    
    return !!purchase;
    
    
},
    
    // Get all purchases by a pupil (for their history)
    findByPupil: async (pupilId) => {
        // Returns: array of purchases
    return await RewardPurchase
        .find({ pupilId: pupilId })
        .sort({ createdAt: -1 });    }
    
};

export default purchaseRepository