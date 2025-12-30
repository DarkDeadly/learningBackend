import rewardService from "../services/rewardServices.js"
import { handleServiceError } from "../utils/error-helper.js"

const createReward = async(req, res) => {
    const teacherId = req.user.id 
    const classroomId = req.params.id  
    const { name, cost, expiresAt } = req.body
    
    try {
        const { success, reward } = await rewardService.create(
            teacherId, 
            classroomId,   
            name, 
            cost, 
            new Date(expiresAt)
        )
        return res.status(201).json({ reward, success })
    } catch (error) {
        return handleServiceError(res, error)
    } 
}
const getClassroomRewards = async (req , res) => {
    const teacherId = req.user.id
    const classroomId = req.params.id
    try {
        const {reward} = await rewardService.getByClassroom(teacherId , classroomId)
        return res.status(200).json({reward : reward })
    } catch (error) {
       return handleServiceError(res, error)
    } 
}
const updateReward = async (req , res) => {
    const teacherId = req.user.id
    const rewardId = req.params.id
    const updateData = req.body
    
    try {
         if (updateData.expiresAt) {
            updateData.expiresAt = new Date(updateData.expiresAt)
        }

        const { success, reward } = await rewardService.update(
            teacherId, 
            rewardId, 
            updateData
        )
        return res.status(201).json({success ,message : "تم تحديث البيانات بنجاح", reward})
    } catch (error) {
        return handleServiceError(res, error)
    }
}

const deleteReward = async (req, res) => {
    const teacherId = req.user.id
    const rewardId = req.params.id
    try {
        const {success} = await rewardService.delete(teacherId , rewardId)
        return res.status(200).json({success : success , message : "تم الحذف بنجاح"})
    } catch (error) {
        return handleServiceError(res, error)
    }
}
const getAvailableRewards = async(req , res) => {
    const pupilId = req.user.id 
    try {
        const {rewards , currentPoints} = await rewardService.getAvailableForPupil(pupilId)
        return res.status(200).json({rewards : rewards , currentPoints : currentPoints})

    } catch (error) {
          return handleServiceError(res, error)
    }
}

const purchaseReward = async (req, res) => {
    const pupilId = req.user.id;
    const rewardId = req.params.id;
    
    try {
        const result = await rewardService.purchase(pupilId, rewardId);
        
        return res.status(200).json({
            success: true,
            message: "تم شراء المكافأة بنجاح",
            purchase: result.purchase,
            newBalance: result.newBalance
        });
    } catch (error) {
        return handleServiceError(res, error);
    }
};


export {getAvailableRewards , createReward , deleteReward , updateReward , getClassroomRewards , purchaseReward}