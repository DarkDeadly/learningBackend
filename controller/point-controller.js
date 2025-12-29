import pointService from "../services/pointServices.js"

const givePoints = async(req , res) => {
    const {pupilId , amount , reason} = req.body
    const teacherId = req.user.id;
    const classroomId = req.params.id;

    try {
        const result = await pointService.givePoints(teacherId , pupilId , classroomId , amount , reason)
        return res.status(200).json({success : result.success , transaction : result.transaction})
    } catch (error) {
        console.error(error) 
        if (error.message === "Classroom not found") {
            return res.status(404).json({error : "الصف غير موجود"})
        }
        if(error.message === "Not your classroom"){
            return res.status(403).json({error : "ليس صفك"})
        }
        if(error.message === "Pupil not in this classroom") {
            return res.status(400).json({error : "هذا التلميذ ليس في هذا الصف"})
        }
        return res.status(500).json({error : "Server error"})
    }
}
const removePoints = async (req , res) => {
    const {pupilId , amount , reason} = req.body
    const teacherId = req.user.id;
    const classroomId = req.params.id;
    try {
        const result = await pointService.removePoints(teacherId , pupilId , classroomId , amount , reason)   
        return res.status(200).json({success : result.success , transaction : result.transaction})
    } catch (error) {
         if (error.message === "Classroom not found") {
            return res.status(404).json({error : "الصف غير موجود"})
        }
        if(error.message === "Not your classroom"){
            return res.status(403).json({error : "ليس صفك"})
        }
        if(error.message === "Pupil not in this classroom") {
            return res.status(400).json({error : "هذا التلميذ ليس في هذا الصف"})
        }
        return res.status(500).json({error : "Server error"})
    }
}
const getPupilHistory = async( req , res ) => {
     const { pupilId } = req.params;
    try {
      const result = await pointService.getHistory(pupilId)   
      return res.status(200).json({success : true , history : result})
    } catch (error) {
       return res.status(500).json({error : "Server Error"}) 
    }
}

export {getPupilHistory , givePoints , removePoints}
