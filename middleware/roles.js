import auth from "./auth.js"


const requireRole = (role) => {
    return async (req , res , next) => {
        if (!req.user)  {
            return res.status(401).json({message : "not Authenticated"})
        }
        if (req.user.role !== role){
            return res.status(400).json({message : `Access denied. ${role} role required.`})
        }
        next()
    }
}

const requireTeacher = [auth , requireRole("teacher")]
const requireAdmin = [auth , requireRole("admin")]
const requirePupil = [auth , requireRole("pupil")]


export {requireTeacher , requireAdmin,requirePupil}