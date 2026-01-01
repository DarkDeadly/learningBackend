// controllers/course-controller.js

import courseService from "../services/courseService.js";

const handleCourseError = (error, res) => {
    const errorMap = {
        "Classroom not found": { status: 404, message: "الصف غير موجود" },
        "Not your classroom": { status: 403, message: "ليس صفك" },
        "Course not found": { status: 404, message: "الدورة غير موجودة" },
        "Not your course": { status: 403, message: "ليست دورتك" },
        "Material not found": { status: 404, message: "المحتوى غير موجود" },
        "No file uploaded": { status: 400, message: "لم يتم رفع أي ملف" },
        "Access denied": { status: 403, message: "ليس لديك إذن" },
        "No valid fields to update": { status: 400, message: "لا يوجد بيانات صالحة للتحديث" }
    };

    const errorResponse = errorMap[error.message];
    if (errorResponse) {
        return res.status(errorResponse.status).json({
            success: false,
            message: errorResponse.message
        });
    }

    return res.status(500).json({ success: false, message: "Server Error" });
};

// ═══════════════════════════════════════════
// COURSE CONTROLLERS
// ═══════════════════════════════════════════

const createCourse = async (req, res) => {
    const teacherId = req.user.id;
    const classroomId = req.params.id;  // ← Changed from classroomId to id
    const { title, description } = req.body;

    try {
        const result = await courseService.createCourse(
            teacherId, classroomId, title, description
        );

        return res.status(201).json({
            success: true,
            message: "تم إنشاء الدورة بنجاح",
            course: result.course
        });
    } catch (error) {
        console.error("Create course error:", error);
        return handleCourseError(error, res);
    }
};

const getCourses = async (req, res) => {
    const userId = req.user.id;
    const classroomId = req.params.id;  // ← Changed

    try {
        const result = await courseService.getCoursesByClassroom(userId, classroomId);

        return res.status(200).json({
            success: true,
            courses: result.coursesWithMaterials
        });
    } catch (error) {
        console.error("Get courses error:", error);
        return handleCourseError(error, res);
    }
};

const getCourseDetails = async (req, res) => {
    const userId = req.user.id;
    const courseId = req.params.courseId;  // ← Changed from id to courseId

    try {
        const result = await courseService.getCourseDetails(userId, courseId);

        return res.status(200).json({
            success: true,
            course: result.course,
            materials: result.materials
        });
    } catch (error) {
        console.error("Get course details error:", error);
        return handleCourseError(error, res);
    }
};

const updateCourse = async (req, res) => {
    const teacherId = req.user.id;
    const courseId = req.params.courseId;  // ← Changed
    const updateData = req.body;

    try {
        const result = await courseService.updateCourse(teacherId, courseId, updateData);

        return res.status(200).json({
            success: true,
            message: "تم تحديث الدورة بنجاح",
            course: result.course
        });
    } catch (error) {
        console.error("Update course error:", error);
        return handleCourseError(error, res);
    }
};

const deleteCourse = async (req, res) => {
    const teacherId = req.user.id;
    const courseId = req.params.courseId;  // ← Changed

    try {
        await courseService.deleteCourse(teacherId, courseId);

        return res.status(200).json({
            success: true,
            message: "تم حذف الدورة بنجاح"
        });
    } catch (error) {
        console.error("Delete course error:", error);
        return handleCourseError(error, res);
    }
};

// ═══════════════════════════════════════════
// MATERIAL CONTROLLERS
// ═══════════════════════════════════════════

const addMaterial = async (req, res) => {
    const teacherId = req.user.id;
    const courseId = req.params.courseId;  // ← Changed
    const { title } = req.body;
    const file = req.file;

    try {
        const result = await courseService.addMaterial(teacherId, courseId, title, file);

        return res.status(201).json({
            success: true,
            message: "تم رفع التسجيل بنجاح",
            material: result.material
        });
    } catch (error) {
        console.error("Add material error:", error);
        return handleCourseError(error, res);
    }
};

const deleteMaterial = async (req, res) => {
    const teacherId = req.user.id;
    const materialId = req.params.materialId;

    try {
        await courseService.deleteMaterial(teacherId, materialId);

        return res.status(200).json({
            success: true,
            message: "تم حذف المحتوى بنجاح"
        });
    } catch (error) {
        console.error("Delete material error:", error);
        return handleCourseError(error, res);
    }
};

export {
    createCourse,
    getCourses,
    getCourseDetails,
    updateCourse,
    deleteCourse,
    addMaterial,
    deleteMaterial
};