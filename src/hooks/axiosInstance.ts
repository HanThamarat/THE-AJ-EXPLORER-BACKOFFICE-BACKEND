import * as axios from "axios";
import dotenv from "dotenv";
import { Request } from "express";
import jwt from 'jsonwebtoken';

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

export const AxiosInstanceForFindBucket = async () => {
    const token = await jwt.sign(
        { 
            id: 1, 
            username: 'test',
            email: 'test' 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    return axios.create({
        baseURL: process.env.BUCKET_BASE_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
};