// services/courseService.js

import classRepository from "../repositories/classRepository.js";
import courseRepository from "../repositories/courseRepository.js";
import materialRepository from "../repositories/materialRepository.js";
import userRepository from "../repositories/userRepository.js";
import { uploadAudioToCloudinary, deleteFromCloudinary } from "../utils/uploadCloudinary.js";

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

const verifyCourseOwnership = async (teacherId, courseId) => {
    const course = await courseRepository.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }
    if (course.teacherId.toString() !== teacherId.toString()) {
        throw new Error("Not your course");  // Fixed: throw not return
    }
    return course;
};

const verifyClassroomOwnership = async (teacherId, classroomId) => {
    const classroom = await classRepository.findById(classroomId);
    if (!classroom) {
        throw new Error("Classroom not found");
    }
    if (classroom.teacherId.toString() !== teacherId.toString()) {
        throw new Error("Not your classroom");
    }
    return classroom;
};

// ═══════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════

const courseService = {

    // ═══════════════════════════════════════════
    // COURSE OPERATIONS
    // ═══════════════════════════════════════════

    createCourse: async (teacherId, classroomId, title, description) => {
        await verifyClassroomOwnership(teacherId, classroomId);

        const course = await courseRepository.create({
            title,
            description,
            classroomId,   // Added!
            teacherId      // Added!
        });

        return { success: true, course };
    },

    getCoursesByClassroom: async (userId, classroomId) => {
        const classroom = await classRepository.findById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found");
        }

        // Check if teacher OR pupil
        const isTeacher = classroom.teacherId.toString() === userId.toString();
        const isPupil = await userRepository.isInClassroom(userId, classroomId);

        if (!isTeacher && !isPupil) {
            throw new Error("Access denied");
        }

        const courses = await courseRepository.findByClassroom(classroomId);
         const coursesWithMaterials = await Promise.all(
        courses.map(async (course) => {
            const materials = await materialRepository.findByCourse(course._id);
            return {
                _id: course._id,
                title: course.title,
                description: course.description,
                createdAt: course.createdAt,
                materials: materials.map(m => ({
                    _id: m._id,
                    title: m.title,
                    fileUrl: m.fileUrl,
                    duration: m.duration
                })),
                materialCount: materials.length
            };
        })
    );
        return { success: true, coursesWithMaterials };
    },

    getCourseDetails: async (userId, courseId) => {
        const course = await courseRepository.findById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }

        // Check access through classroom
        const classroom = await classRepository.findById(course.classroomId);
        const isTeacher = classroom.teacherId.toString() === userId.toString();
        const isPupil = await userRepository.isInClassroom(userId, course.classroomId);

        if (!isTeacher && !isPupil) {
            throw new Error("Access denied");
        }

        const materials = await materialRepository.findByCourse(courseId);
        return { success: true, course, materials };
    },

    updateCourse: async (teacherId, courseId, updateData) => {
        await verifyCourseOwnership(teacherId, courseId);

        const allowedFields = ["title", "description"];
        const filteredUpdate = {};

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredUpdate[field] = updateData[field];
            }
        }

        if (Object.keys(filteredUpdate).length === 0) {
            throw new Error("No valid fields to update");
        }

        const updatedCourse = await courseRepository.update(courseId, filteredUpdate);
        return { success: true, course: updatedCourse };
    },

    deleteCourse: async (teacherId, courseId) => {
        await verifyCourseOwnership(teacherId, courseId);

        // Get all materials
        const materials = await materialRepository.findByCourse(courseId);

        // Delete from Cloudinary (with await!)
        for (const material of materials) {
            try {
                await deleteFromCloudinary(material.publicId);
            } catch (err) {
                console.error("Cloudinary delete error:", err);
            }
        }

        // Delete all materials from DB
        await materialRepository.deleteByCourse(courseId);

        // Delete course
        await courseRepository.delete(courseId);

        return { success: true };
    },

    // ═══════════════════════════════════════════
    // MATERIAL OPERATIONS
    // ═══════════════════════════════════════════

    addMaterial: async (teacherId, courseId, title, file) => {
        // 1. Verify teacher owns course
        await verifyCourseOwnership(teacherId, courseId);

        // 2. Check file exists (from multer)
        if (!file || !file.buffer) {
            throw new Error("No file uploaded");
        }

        // 3. Upload to Cloudinary
        const uploadResult = await uploadAudioToCloudinary(
            file.buffer,
            file.originalname
        );

        // 4. Create material in DB
        const material = await materialRepository.create({
            courseId,
            title,
            fileUrl: uploadResult.url,
            publicId: uploadResult.publicId,
            duration: uploadResult.duration,
            fileSize: uploadResult.size
        });

        // 5. Return result
        return { success: true, material };
    },

    deleteMaterial: async (teacherId, materialId) => {
        // 1. Find material
        const material = await materialRepository.findById(materialId);
        if (!material) {
            throw new Error("Material not found");
        }

        // 2. Verify teacher owns the course
        await verifyCourseOwnership(teacherId, material.courseId);

        // 3. Delete from Cloudinary
        try {
            await deleteFromCloudinary(material.publicId);
        } catch (err) {
            console.error("Cloudinary delete error:", err);
        }

        // 4. Delete from DB
        await materialRepository.delete(materialId);

        // 5. Return result
        return { success: true };
    }
};

export default courseService;