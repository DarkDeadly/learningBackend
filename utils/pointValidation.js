import * as z from "zod";

export const givePointsSchema = z.object({
    pupilId: z.string().min(1, "معرف التلميذ مطلوب"),
    amount: z.number()
        .positive("يجب أن تكون النقاط أكبر من صفر")
        .int("يجب أن تكون النقاط عدد صحيح")
        .max(1000, "الحد الأقصى 1000 نقطة"),
    reason: z.string()
        .min(3, "السبب قصير جداً")
        .max(200, "السبب طويل جداً")
});

export const removePointsSchema = givePointsSchema; 