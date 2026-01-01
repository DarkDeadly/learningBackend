import express from "express"
import { deleteReward, getAvailableRewards, purchaseReward, updateReward } from "../controller/reward-controller.js"
import auth from "../middleware/auth.js"
import { requirePupil, requireTeacher } from "../middleware/roles.js"
import validate from "../middleware/data-validation.js"
import { updateRewardSchema } from "../utils/rewardValidation.js"

const router = express.Router()


router.patch("/:id" , auth ,validate(updateRewardSchema) ,requireTeacher , updateReward)
router.delete("/:id" , auth , requireTeacher , deleteReward)
router.post("/:id/purchase", auth, requirePupil, purchaseReward);
router.get("/available" , auth , requirePupil , getAvailableRewards)

export default router