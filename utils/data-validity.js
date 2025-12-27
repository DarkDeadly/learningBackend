import * as z from "zod"

const registrationSchema = z.object({
    fullname : z.string().min(3, "يجب أن يكون الاسم الكامل بطول 3 أحرف على الأقل"),
    email: z.email({ message: "تنسيق عنوان البريد الإلكتروني غير صالح" }), // <-- ZOD's built-in email check
         
    password: z.string()
        .min(6, { message: "يجب أن تحتوي كلمة المرور على 6 أحرف أو أكثر" })
        
});
const loginSchema = z.object({
    email: z.email({ message: "تنسيق عنوان البريد الإلكتروني غير صالح" }),
     password: z.string()
        .min(6, { message: "يجب أن تحتوي كلمة المرور على 6 أحرف أو أكثر" })
        
}); 

export { registrationSchema , loginSchema };