import pointService from "../services/pointServices.js"

const handlePointError = (error, res) => {
    const errorMap = {
        "Classroom not found": { status: 404, message: "الصف غير موجود" },
        "Not your classroom": { status: 403, message: "ليس صفك" },
        "Pupil not in this classroom": { status: 400, message: "هذا التلميذ ليس في هذا الصف" }
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



const givePoints = async (req, res) => {
    const { pupilId, amount, reason } = req.body
    const teacherId = req.user.id;
    const classroomId = req.params.id;

    try {
        const result = await pointService.givePoints(teacherId, pupilId, classroomId, amount, reason)
        return res.status(200).json({
            success: true,
            message: "تم إضافة النقاط بنجاح",
            transaction: result.transaction
        });
    } catch (error) {

        console.error(error);
        return handlePointError(error, res);
    }
}
const removePoints = async (req, res) => {
    const { pupilId, amount, reason } = req.body
    const teacherId = req.user.id;
    const classroomId = req.params.id;
    try {
        const result = await pointService.removePoints(teacherId, pupilId, classroomId, amount, reason)
        return res.status(200).json(
            {   success: true,
                message: "تم خصم النقاط بنجاح",
                transaction: result.transaction 
            })
    } catch (error) {
    console.error(error);
    return handlePointError(error, res);
    }
}
const getPupilHistory = async (req, res) => {
    const teacherId = req.user.id;
    const classroomId = req.params.id;
    const pupilId = req.params.pupilId;

    try {
        const result = await pointService.getHistory(teacherId, pupilId, classroomId);
        return res.status(200).json({ success: true, history: result });

    } catch (error) {
        console.error("Get history error:", error);
        return handlePointError(error, res);
    }
};

export { getPupilHistory, givePoints, removePoints }
