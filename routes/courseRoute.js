import express from "express";
import auth from "../middleware/auth.js";
import { requirePupil, requireTeacher } from "../middleware/roles.js";
import { 
    createClass, 
    getClassroomDetails, 
    getClassroomPupils, 
    getMyClassrooms, 
    joinClassroom, 
    removePupil, 

} from "../controller/class-controller.js";
import { getPupilHistory, givePoints, removePoints } from "../controller/point-controller.js";
import { createReward, getClassroomRewards } from "../controller/reward-controller.js";

const router = express.Router();

// ═══════════════════════════════════════════
// TEACHER ROUTES
// ═══════════════════════════════════════════
router.post("/", auth, requireTeacher, createClass);
router.get("/my", auth, requireTeacher, getMyClassrooms);
router.get("/:id/pupils", auth, requireTeacher, getClassroomPupils);
router.post("/leave", auth, requireTeacher, removePupil);
router.post("/:id/points/give" , auth , requireTeacher , givePoints)
router.post("/:id/points/remove" , auth , requireTeacher , removePoints)
router.get("/:id/points/:pupilId" , auth , requireTeacher , getPupilHistory)
//Rewards 
router.post("/:id/rewards" ,auth , requireTeacher , createReward )
router.get("/:id/rewards" , auth , requireTeacher , getClassroomRewards)

// ═══════════════════════════════════════════
// PUPIL ROUTES
// ═══════════════════════════════════════════
router.post("/:id/join", auth, requirePupil, joinClassroom);

// ═══════════════════════════════════════════
// SHARED ROUTES (Any authenticated user)
// ═══════════════════════════════════════════
router.get("/:id", auth, getClassroomDetails);

export default router;