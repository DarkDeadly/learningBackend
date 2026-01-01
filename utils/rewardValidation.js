import * as z from "zod";

export const createRewardSchema = z.object({
    name: z.string()
        .min(2, "اسم المكافأة قصير جداً")
        .max(100, "اسم المكافأة طويل جداً"),
    cost: z.number()
        .positive("يجب أن تكون التكلفة أكبر من صفر")
        .int("يجب أن تكون التكلفة عدد صحيح")
        .max(10000, "الحد الأقصى 10000 نقطة"),
    expiresAt: z.string()
        .refine(val => !isNaN(Date.parse(val)), "تاريخ غير صالح")
        .refine(val => new Date(val) > new Date(), "يجب أن يكون التاريخ في المستقبل")
});

export const updateRewardSchema = z.object({
    name: z.string()
        .min(2, "اسم المكافأة قصير جداً")
        .max(100, "اسم المكافأة طويل جداً")
        .optional(),
    cost: z.number()
        .positive("يجب أن تكون التكلفة أكبر من صفر")
        .int("يجب أن تكون التكلفة عدد صحيح")
        .max(10000, "الحد الأقصى 10000 نقطة")
        .optional(),
    expiresAt: z.string()
        .refine(val => !isNaN(Date.parse(val)), "تاريخ غير صالح")
        .refine(val => new Date(val) > new Date(), "يجب أن يكون التاريخ في المستقبل")
        .optional()
});