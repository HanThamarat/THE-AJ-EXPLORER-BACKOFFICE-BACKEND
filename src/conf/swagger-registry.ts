import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { packageReviwResponseSchema, reviewDTOSchema, reviewEntitySchema, reviewResponseSchema } from "../core/entity/review";

export const zodSwaggerGeneratorRegistry = new OpenAPIRegistry();

// review schema
zodSwaggerGeneratorRegistry.register("reviewDTO", reviewDTOSchema);
zodSwaggerGeneratorRegistry.register("reviewEntity", reviewEntitySchema);
zodSwaggerGeneratorRegistry.register("myReviewResponse", reviewResponseSchema);
zodSwaggerGeneratorRegistry.register("packageReviewResponse", packageReviwResponseSchema);

export const generateZodComponent = () => {
    const generator = new OpenApiGeneratorV3(zodSwaggerGeneratorRegistry.definitions);

    const doc = generator.generateDocument({
        openapi: "3.0.0",
        info: { title: "temp", version: "1.0.0" }
    });

    return doc.components ?? {};
}