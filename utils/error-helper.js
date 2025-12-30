export const handleServiceError = (res, error) => {
    console.error(error)
    
    const errorMap = {
        "Resource not found": { 
            status: 404, 
            message: "لم يتم العثور على المورد" 
        },
        "Expiration date must be in the future": { 
            status: 400, 
            message: "يجب أن يكون تاريخ الصلاحية في المستقبل" 
        },
        "expiresAt must be a valid future date": { 
            status: 400, 
            message: "يجب أن يكون تاريخ الصلاحية في المستقبل" 
        },
        "No valid fields to update": { 
            status: 400, 
            message: "لا يوجد بيانات صالحة للتحديث" 
        },
        "Not enrolled in any classroom": { 
            status: 400, 
            message: "غير مسجل في أي فصل" 
        },
         "Reward not in your classroom": {
            status: 403,
            message: "هذه المكافأة ليست في فصلك"
        },
        "Reward has expired": {
            status: 400,
            message: "انتهت صلاحية هذه المكافأة"
        },
        "Already purchased this reward": {
            status: 400,
            message: "لقد اشتريت هذه المكافأة من قبل"
        },
        "Insufficient points": {
            status: 400,
            message: "نقاط غير كافية"
        }
    }
    
    const mapped = errorMap[error.message]
    
    if (mapped) {
        return res.status(mapped.status).json({ error: mapped.message })
    }
    
    return res.status(500).json({ error: "Server Error" })
}