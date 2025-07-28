import { Response } from 'express';

interface SetResponseType {
    res: Response,
    statusCode: number,
    message: string,
    body: any
}

interface SetErrResponseType {
    res: Response,
    statusCode: number,
    message: string,
    error: any
}

export const setResponse = ({ res, statusCode, message, body }:SetResponseType) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        body: body
    });
};

export const setErrResponse = ({ res, statusCode, message, error }:SetErrResponseType) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        error: error
    });
};