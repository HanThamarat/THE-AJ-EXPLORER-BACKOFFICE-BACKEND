import * as axios from "axios";
import dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

export const AxiosInstance = (req: Request) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return null;
    }

    return axios.create({
        baseURL: process.env.BUCKET_BASE_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
};

export const AxiosInstanceMultipart = (req: Request) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return null;
    }

    return axios.create({
        baseURL: process.env.BUCKET_BASE_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        },
    });
};