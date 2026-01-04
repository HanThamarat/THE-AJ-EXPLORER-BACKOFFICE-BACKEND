import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const encodedCreds = process.env.FIREBASE_CREDENTAIL;

if (!encodedCreds) {
    throw new Error("FIREBASE_CREDENTAIL is missing from env variables");
}

const decodedString = Buffer.from(encodedCreds, 'base64').toString('utf-8');
const firebaseCredential = JSON.parse(decodedString);

export const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 100000000000,
        timeout: 200000000000,
    }
});

admin.initializeApp({
    credential: admin.credential.cert(firebaseCredential),
});

export const firestoreDb = admin.firestore();