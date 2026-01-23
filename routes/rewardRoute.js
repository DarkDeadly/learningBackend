import express from "express";
import { 
    deleteReward, 
    getAvailableRewards, 
    purchaseReward, 
    updateReward, 
    createReward, 
    getClassroomRewards,
    awardClassPoints // Our new bulk feature
} from "../controller/reward-controller.js";
import auth from "../middleware/auth.js";
import { requirePupil, requireTeacher } from "../middleware/roles.js";
import validate from "../middleware/data-validation.js";
import { updateRewardSchema, createRewardSchema } from "../utils/rewardValidation.js";

const router = express.Router();

/**
 * TEACHER ROUTES
 */

// Create a reward for a class: POST /api/rewards/class/:id
router.post(
    "/class/:id", 
    auth, 
    requireTeacher, 
    validate(createRewardSchema), 
    createReward
);

// Get all rewards for a class: GET /api/rewards/class/:id
router.get(
    "/class/:id", 
    auth, 
    requireTeacher, 
    getClassroomRewards
);

// Bulk Award Points: POST /api/rewards/class/:id/award
router.post(
    "/class/:id/award", 
    auth, 
    requireTeacher, 
    awardClassPoints
);

// Manage specific reward: PATCH/DELETE /api/rewards/:id
router.patch(
    "/:id", 
    auth, 
    requireTeacher, 
    validate(updateRewardSchema), 
    updateReward
);

router.delete(
    "/:id", 
    auth, 
    requireTeacher, 
    deleteReward
);

/**
 * PUPIL ROUTES
 */

// Get rewards available to me: GET /api/rewards/available
router.get(
    "/available", 
    auth, 
    requirePupil, 
    getAvailableRewards
);

// Purchase a reward: POST /api/rewards/:id/purchase
router.post(
    "/:id/purchase", 
    auth, 
    requirePupil, 
    purchaseReward
);

export default router;