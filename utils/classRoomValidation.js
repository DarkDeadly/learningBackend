import * as z from "zod";

export const createClassSchema = z.object({
    name: z.string()
        .min(2, "اسم الفصل قصير جداً")
        .max(100, "اسم الفصل طويل جداً"),
    description: z.string()
        .max(500, "الوصف طويل جداً")
        .optional(),
    pin: z.string()
        .length(4, "يجب أن يكون الرمز 4 أرقام")
        .regex(/^\d+$/, "يجب أن يحتوي على أرقام فقط")
});

export const joinClassSchema = z.object({
    pin: z.string()
        .length(4, "يجب أن يكون الرمز 4 أرقام")
        .regex(/^\d+$/, "يجب أن يحتوي على أرقام فقط")
});