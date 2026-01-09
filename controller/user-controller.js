import authService from "../services/authServices.js"


const COOKIE_OPTIONS = {
    httpOnly: true,                              // JavaScript cannot access
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",                          // CSRF protection
    maxAge: 15 * 24 * 60 * 60 * 1000            // 15 days in milliseconds
};


const register = async (req, res) => {
    const { fullname, email, password } = req.body;
    
    try {
        const { user, accessToken, refreshToken } = await authService.register(
            fullname, 
            email, 
            password
        );
        
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        
        return res.status(201).json({
            success: true,
            message: "تم التسجيل بنجاح",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                pointBalance: user.pointBalance

            },
            accessToken
        });
        
    } catch (error) {
        console.error("Register error:", error);
        
        if (error.message === "Email already registered !") {
            return res.status(409).json({ 
                success: false, 
                message: "عنوان البريد الإلكتروني مسجّل مسبقًا" 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const { user, accessToken, refreshToken } = await authService.login(
            email, 
            password
        );
        
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        
        return res.status(200).json({
            success: true,
            message: "تم تسجيل الدخول بنجاح",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                pointBalance: user.pointBalance

            },
            accessToken
        });
        
    } catch (error) {
        console.error("Login error:", error);
        
        if (error.message === "Invalid credentials") {
            return res.status(401).json({ 
                success: false, 
                message: "بيانات الدخول غير صحيحة" 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};

const refreshAccess = async (req, res) => {
    const token = req.cookies.refreshToken;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No refresh token provided"
        });
    }
    
    try {
        const { accessToken, refreshToken } = await authService.refresh(token);
        
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        
        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            accessToken
        });
        
    } catch (error) {
        console.error("Refresh error:", error);
        
        if (error.message === "Invalid or expired token") {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    
    try {
        if (token) {
            await authService.logout(token);
        }
        
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        
        return res.status(200).json({
            success: true,
            message: "تم تسجيل الخروج بنجاح"
        });
        
    } catch (error) {
        console.error("Logout error:", error);
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        return res.status(200).json({
            success: true,
            message: "تم تسجيل الخروج بنجاح"
        });
    }
};

const logoutAllDevices = async (req, res) => {
    const userId = req.user.id;
    
    try {
        await authService.logoutAll(userId);
        
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        
        return res.status(200).json({
            success: true,
            message: "تم تسجيل الخروج من جميع الأجهزة بنجاح"
        });
        
    } catch (error) {
        console.error("LogoutAll error:", error);
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const currentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await authService.profile(userId);
        
        // User might have been deleted
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            user: result
        });
        
    } catch (error) {
        console.error("Profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export {logout , refreshAccess , login , register , logoutAllDevices , currentUser}