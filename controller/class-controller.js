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
            classroom: {
                id: classroom._id,
                name: classroom.name,
                description: classroom.description,
                teacherId: classroom.teacherId,
                isActive: classroom.isActive,
                createdAt: classroom.createdAt

            }
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

        // Map each classroom to DTO format
        const formattedClassrooms = classrooms.map(classroom => ({
            id: classroom._id,
            name: classroom.name,
            description: classroom.description,
            isActive: classroom.isActive,
            createdAt: classroom.createdAt
        }))
        return res.status(200).json({
            success: true,
            classrooms: formattedClassrooms,  // Use plural!
            count: formattedClassrooms.length
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
    const { pin } = req.body;  // ADD: Get PIN from body

    try {
        const result = await classroomService.joinClassroom(
            pupilId,
            classroomId,
            pin  // ADD: Pass PIN
        );

        return res.status(200).json({
    success: true,
    message: "تم الانضمام بنجاح",
    classroom: {
        id: result.classroom._id,
        name: result.classroom.name,
        description: result.classroom.description
    }
});

    } catch (error) {
        console.error("Join classroom error:", error);

        if (error.message === "Classroom not found") {
            return res.status(404).json({
                success: false,
                message: "الفصل غير موجود"
            });
        }

        if (error.message === "Invalid PIN") {
            return res.status(401).json({
                success: false,
                message: "رمز PIN غير صحيح"
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

const getClassroomDetails = async (req, res) => {
    const classroomId = req.params.id;
    const userId = req.user.id;  // ADD THIS!

    try {
        const classroom = await classroomService.getClassroomDetails(
            classroomId, 
            userId  // ADD THIS!
        );

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

        // ADD: Handle access denied
        if (error.message === "Access denied") {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية للوصول"
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
            pupils,
            counts : pupils.length
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
    const classroomId = req.params.id;      // FIXED: :id is classroom
    const pupilId = req.params.pupilId;     // FIXED: :pupilId is pupil

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

    const deactivateClass = async (req, res) => {
    const teacherId = req.user.id;
    const classroomId = req.params.id;

    try {
        await classroomService.deactivateClassroom(teacherId, classroomId);

        return res.status(200).json({
            success: true,
            message: "تم إلغاء تفعيل الفصل بنجاح"
        });

    } catch (error) {
        console.error("Deactivate classroom error:", error);

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

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


const getAllClasses = async (req , res) => {
    try {
      const result = await classroomService.getallclassrooms()
      return res.status(200).json({success : result.success , classrooms : result.class})  
    } catch (error) {
      if (error.message === "there is no classrooms")  {
        return res.status(400).json({
            success : false , 
            message : "لم يتم العثور على أي فصول دراسية"
        })
      }
    }
}

export {
    createClass,
    getMyClassrooms,
    joinClassroom,
    getClassroomDetails,
    getClassroomPupils,
    removePupil,
    deactivateClass,
    getAllClasses
};