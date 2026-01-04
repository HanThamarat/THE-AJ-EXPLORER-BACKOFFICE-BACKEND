import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const firebaseCredential = JSON.parse(process.env.FIREBASE_CREDENTAIL as string);

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