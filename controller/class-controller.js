import classroomService from "../services/classServices.js";

const createClass = async (req, res) => {
    const teacherId = req.user.id;
    const { name, description, pin } = req.body;
    
    try {
        const classroom = await classroomService.create(
            teacherId,
            name,
            description,
            pin
        );
        
        return res.status(201).json({
            success: true,
            message: "تم إنشاء الفصل بنجاح",
            classroom
        });
        
    } catch (error) {
        console.error("Create classroom error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getMyClassrooms = async (req, res) => {
    const teacherId = req.user.id;
    
    try {
        const classrooms = await classroomService.getTeacherClassrooms(teacherId);
        
        return res.status(200).json({
            success: true,
            classrooms
        });
        
    } catch (error) {
        console.error("Get classrooms error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const joinClassroom = async (req, res) => {
    const pupilId = req.user.id;
    const classroomId = req.params.id;
    
    try {
        const result = await classroomService.joinClassroom(pupilId, classroomId);
        
        return res.status(200).json({
            success: true,
            message: "تم الانضمام بنجاح",
            classroom: result.classroom
        });
        
    } catch (error) {
        console.error("Join classroom error:", error);
        
        if (error.message === "Classroom not found") {
            return res.status(404).json({
                success: false,
                message: "الفصل غير موجود"
            });
        }
        
        if (error.message === "Already enrolled in a classroom") {
            return res.status(400).json({
                success: false,
                message: "أنت مسجل بالفعل في فصل"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const verifyPin = async (req, res) => {
    const classroomId = req.params.id;
    const { pin } = req.body;
    
    try {
        await classroomService.verifyPin(classroomId, pin);
        
        return res.status(200).json({
            success: true,
            message: "تم التحقق بنجاح"
        });
        
    } catch (error) {
        console.error("Verify PIN error:", error);
        
        if (error.message === "Invalid classroom or PIN") {
            return res.status(401).json({
                success: false,
                message: "رمز PIN غير صحيح"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getClassroomDetails = async (req, res) => {
    const classroomId = req.params.id;
    
    try {
        const classroom = await classroomService.getClassroomDetails(classroomId);
        
        return res.status(200).json({
            success: true,
            classroom
        });
        
    } catch (error) {
        console.error("Get classroom details error:", error);
        
        if (error.message === "Classroom not found") {
            return res.status(404).json({
                success: false,
                message: "الفصل غير موجود"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getClassroomPupils = async (req, res) => {
    const classroomId = req.params.id;
    
    try {
        const pupils = await classroomService.getClassroomPupils(classroomId);
        
        return res.status(200).json({
            success: true,
            pupils
        });
        
    } catch (error) {
        console.error("Get pupils error:", error);
        
        if (error.message === "Classroom not found") {
            return res.status(404).json({
                success: false,
                message: "الفصل غير موجود"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const removePupil = async (req, res) => {
    const teacherId = req.user.id;
    const { classroomId, pupilId } = req.body;
    
    try {
        await classroomService.removePupil(teacherId, pupilId, classroomId);
        
        return res.status(200).json({
            success: true,
            message: "تم إزالة الطالب بنجاح"
        });
        
    } catch (error) {
        console.error("Remove pupil error:", error);
        
        if (error.message === "Classroom not found") {
            return res.status(404).json({
                success: false,
                message: "الفصل غير موجود"
            });
        }
        
        if (error.message === "Not your classroom") {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية"
            });
        }
        
        if (error.message === "Pupil not in this classroom") {
            return res.status(400).json({
                success: false,
                message: "الطالب ليس في هذا الفصل"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export {
    createClass,
    getMyClassrooms,
    joinClassroom,
    verifyPin,
    getClassroomDetails,
    getClassroomPupils,
    removePupil
};