import rewardService from "../services/rewardServices.js";
import { handleServiceError } from "../utils/error-helper.js";

/**
 * TEACHER ACTIONS
 */

// Create a new reward for a specific classroom
const createReward = async (req, res) => {
    const teacherId = req.user.id;
    const classroomId = req.params.id; // classroom ID from URL
    const { name, cost, expiresAt } = req.body;
    
    try {
        const { success, reward } = await rewardService.create(
            teacherId, 
            classroomId,   
            name, 
            cost, 
            new Date(expiresAt)
        );
        return res.status(201).json({ success, reward });
    } catch (error) {
        return handleServiceError(res, error);
    } 
};

// Get all rewards (including expired) for a teacher to manage
const getClassroomRewards = async (req, res) => {
    const classroomId = req.params.id;
    try {
        const { reward } = await rewardService.getByClassroom( classroomId);
        return res.status(200).json({ success: true, reward });
    } catch (error) {
        return handleServiceError(res, error);
    } 
};

// Update reward details
const updateReward = async (req, res) => {
    const teacherId = req.user.id;
    const rewardId = req.params.id;
    const updateData = req.body;
    
    try {
        const { success, reward } = await rewardService.update(
            teacherId, 
            rewardId, 
            updateData
        );
        return res.status(200).json({
            success, 
            message: "تم تحديث البيانات بنجاح", 
            reward
        });
    } catch (error) {
        return handleServiceError(res, error);
    }
};

// Delete a reward
const deleteReward = async (req, res) => {
    const teacherId = req.user.id;
    const rewardId = req.params.id;
    try {
        const { success } = await rewardService.delete(teacherId, rewardId);
        return res.status(200).json({ success, message: "تم الحذف بنجاح" });
    } catch (error) {
        return handleServiceError(res, error);
    }
};

// NEW: Award points to every student in a class at once
const awardClassPoints = async (req, res) => {
    const teacherId = req.user.id;
    const classroomId = req.params.id;
    const { amount, reason } = req.body;

    try {
        const result = await rewardService.awardPointsToClass(
            teacherId, 
            classroomId, 
            amount, 
            reason
        );
        return res.status(200).json({
            success: true,
            message: `تم منح النقاط لـ ${result.pupilsRewarded} طالب بنجاح`,
            count: result.pupilsRewarded
        });
    } catch (error) {
        return handleServiceError(res, error);
    }
};

/**
 * PUPIL ACTIONS
 */

// Get rewards available to the pupil (Active + Purchase Status)
const getAvailableRewards = async (req, res) => {
    const pupilId = req.user.id; 
    try {
        const { rewards, currentPoints } = await rewardService.getAvailableForPupil(pupilId);
        return res.status(200).json({
            success: true,
            rewards, 
            currentPoints
        });
    } catch (error) {
        return handleServiceError(res, error);
    }
};

// Purchase a reward using points
const purchaseReward = async (req, res) => {
    const pupilId = req.user.id;
    const rewardId = req.params.id;
    
    try {
        const result = await rewardService.purchase(pupilId, rewardId);
        
        return res.status(200).json({
            success: true,
            message: "تم شراء المكافأة بنجاح",
            newBalance: result.newBalance
        });
    } catch (error) {
        return handleServiceError(res, error);
    }
};

const getPupilPurchasesForTeacher = async (req, res) => {
    const teacherId = req.user.id;
    // Destructuring params for cleaner code
    const { id: classroomId, pupilId } = req.params; 

    try {
        const result = await rewardService.getPupilPurchaseHistory(
            pupilId, 
            teacherId, 
            classroomId
        );
        
        return res.status(200).json(result);
    } catch (error) {
        // handleServiceError handles the 403 or 404 based on the error message
        return handleServiceError(res, error);
    }
};
export {
    getAvailableRewards, 
    createReward, 
    deleteReward, 
    updateReward, 
    getClassroomRewards, 
    purchaseReward,
    awardClassPoints,
    getPupilPurchasesForTeacher
};