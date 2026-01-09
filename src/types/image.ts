
import { z } from "zod";

export const imageDTOSchema = z.object({
    base64: z.string().min(1, "Image payload must include base64 data."),
    fileName: z.string().min(1, "Image payload must include fileName."),
    mainFile: z.boolean(),
});

export type imageDTO = z.infer<typeof imageDTOSchema>;

export const imageEntitySchema = z.object({
    file_name: z.string(),
    file_original_name: z.string(),
    file_path: z.string(),
    mainFile: z.boolean(),
    base64: z.string().nullable().optional(),
});

export type imageEntity = z.infer<typeof imageEntitySchema>;