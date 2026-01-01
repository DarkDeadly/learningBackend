// routes/classroomRoutes.js

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
import {
    createCourse,
    getCourses,
    getCourseDetails,
    updateCourse,
    deleteCourse,
    addMaterial,
    deleteMaterial
} from "../controller/course-controller.js";  // 🆕 ADD
import { createClassSchema, joinClassSchema } from "../utils/classRoomValidation.js";
import validate from "../middleware/data-validation.js";
import { givePointsSchema, removePointsSchema } from "../utils/pointValidation.js";
import { createRewardSchema } from "../utils/rewardValidation.js";
import { uploadAudio } from "../middleware/upload.js";  // 🆕 ADD

const router = express.Router();

// ═══════════════════════════════════════════
// TEACHER ROUTES - CLASSROOM
// ═══════════════════════════════════════════
router.post("/", auth, validate(createClassSchema), requireTeacher, createClass);
router.get("/my", auth, requireTeacher, getMyClassrooms);
router.get("/:id/pupils", auth, requireTeacher, getClassroomPupils);
router.delete("/:id/pupils/:pupilId", auth, requireTeacher, removePupil);
router.delete("/:id", auth, requireTeacher, deactivateClass);

// ═══════════════════════════════════════════
// TEACHER ROUTES - POINTS
// ═══════════════════════════════════════════
router.post("/:id/points/give", auth, validate(givePointsSchema), requireTeacher, givePoints);
router.post("/:id/points/remove", auth, validate(removePointsSchema), requireTeacher, removePoints);
router.get("/:id/points/:pupilId", auth, requireTeacher, getPupilHistory);

// ═══════════════════════════════════════════
// TEACHER ROUTES - REWARDS
// ═══════════════════════════════════════════
router.post("/:id/rewards", auth, validate(createRewardSchema), requireTeacher, createReward);
router.get("/:id/rewards", auth, requireTeacher, getClassroomRewards);

// ═══════════════════════════════════════════
// TEACHER ROUTES - COURSES 🆕
// ═══════════════════════════════════════════
router.post("/:id/courses", auth, requireTeacher, createCourse);
router.patch("/:id/courses/:courseId", auth, requireTeacher, updateCourse);
router.delete("/:id/courses/:courseId", auth, requireTeacher, deleteCourse);

// ═══════════════════════════════════════════
// TEACHER ROUTES - MATERIALS 🆕
// ═══════════════════════════════════════════
router.post(
    "/:id/courses/:courseId/materials",
    auth,
    requireTeacher,
    uploadAudio.single('file'),
    addMaterial
);
router.delete(
    "/:id/courses/:courseId/materials/:materialId",
    auth,
    requireTeacher,
    deleteMaterial
);

// ═══════════════════════════════════════════
// PUPIL ROUTES
// ═══════════════════════════════════════════
router.post("/:id/join", auth, validate(joinClassSchema), requirePupil, joinClassroom);

// ═══════════════════════════════════════════
// SHARED ROUTES (Teacher & Pupil)
// ═══════════════════════════════════════════
router.get("/:id", auth, getClassroomDetails);
router.get("/:id/courses", auth, getCourses);  // 🆕 Both can view courses
router.get("/:id/courses/:courseId", auth, getCourseDetails);  // 🆕 Both can view details

export default router;