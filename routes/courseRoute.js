import express from "express";
import auth from "../middleware/auth.js";
import { requirePupil, requireTeacher } from "../middleware/roles.js";
import { 
    createClass, 
    deactivateClass, 
    getClassroomDetails, 
    getClassroomPupils, 
    getMyClassrooms, 
    joinClassroom, 
    removePupil, 

} from "../controller/class-controller.js";
import { getPupilHistory, givePoints, removePoints } from "../controller/point-controller.js";
import { createReward, getClassroomRewards } from "../controller/reward-controller.js";
import { createClassSchema, joinClassSchema } from "../utils/classRoomValidation.js";
import validate from "../middleware/data-validation.js";

const router = express.Router();

// ═══════════════════════════════════════════
// TEACHER ROUTES
// ═══════════════════════════════════════════
router.post("/", auth, validate(createClassSchema), requireTeacher, createClass);
router.get("/my", auth, requireTeacher, getMyClassrooms);
router.get("/:id/pupils", auth, requireTeacher, getClassroomPupils);
router.delete("/:id/pupils/:pupilId", auth, requireTeacher, removePupil
);router.post("/:id/points/give" , auth , requireTeacher , givePoints)
router.post("/:id/points/remove" , auth , requireTeacher , removePoints)
router.get("/:id/points/:pupilId" , auth , requireTeacher , getPupilHistory)
router.delete("/:id", auth, requireTeacher, deactivateClass);
//Rewards 
router.post("/:id/rewards" ,auth , requireTeacher , createReward )
router.get("/:id/rewards" , auth , requireTeacher , getClassroomRewards)

// ═══════════════════════════════════════════
// PUPIL ROUTES
// ═══════════════════════════════════════════
router.post("/:id/join", auth,validate(joinClassSchema), requirePupil, joinClassroom);

// ═══════════════════════════════════════════
// SHARED ROUTES (Any authenticated user)
// ═══════════════════════════════════════════
router.get("/:id", auth, getClassroomDetails);

export default router;