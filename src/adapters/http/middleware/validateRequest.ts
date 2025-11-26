import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { setErrResponse } from "../../../hooks/response";

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
            req.params = await schemas.params.parseAsync(req.params);
        }

        if (schemas.query) {
            req.query = await schemas.query.parseAsync(req.query);
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

