import express from "express"
import { AuthRateLimit } from "../middleware/rate-limiting.js"
import validate from "../middleware/data-validation.js"
import { loginSchema, registrationSchema } from "../utils/data-validity.js"
import { currentUser, login, logout, logoutAllDevices, refreshAccess, register } from "../controller/user-controller.js"
import auth from "../middleware/auth.js"


const router = express.Router()

router.post("/register" , AuthRateLimit , validate(registrationSchema) ,register)
router.post("/login" , validate(loginSchema) , login)
router.post("/refresh" , refreshAccess)
router.post("/logout" , logout)
router.post("/logoutAll" , auth , logoutAllDevices)
router.get('/profile' , auth , currentUser)





export default router