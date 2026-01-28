import { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";
import { setErrResponse } from "../../../hooks/response";

type AnyZodObject = z.ZodObject<z.ZodRawShape>;

type SchemaTargets = {
    body?: AnyZodObject;
    params?: AnyZodObject;
    query?: AnyZodObject;
};

export const validateRequest = (schemas: SchemaTargets) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (schemas.body) {
            req.body = await schemas.body.parseAsync(req.body);
        }

        if (schemas.params) {
            const parsedParams = await schemas.params.parseAsync(req.params);
            Object.assign(req.params, parsedParams);
        }

        if (schemas.query) {
            const parsedQuery = await schemas.query.parseAsync(req.query);
            Object.assign(req.query, parsedQuery);
        }

        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return setErrResponse({
                res,
                statusCode: 400,
                message: "Validation failed.",
                error: error.flatten(),
            });
        }

        return next(error);
    }
};

