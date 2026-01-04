import { NextFunction, Request, Response } from "express";
import { logger } from "../adapters/helpers/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info(`HTTP ${req.method} ${req.url}`, {
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        });
    });

    next();
};