import { firestoreDb } from "../database/data-source";
import { Firestore } from 'firebase-admin/firestore';

interface LogEntry {
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
    meta?: any;
    timestamp: Date;
  }

export class Logger {
    private collactionName = "app_logs";

    async log(level: 'INFO' | 'WARN' | 'ERROR', message: string, meta: any = {}) {
        try {
            const entry: LogEntry = {
                level,
                message,
                meta,
                timestamp: new Date(),
            };
    
            await firestoreDb.collection(this.collactionName).add(entry);
    
            console.log(`[${level}] ${message}`, meta);   
        } catch (error) {
            console.error('Failed to write log to Firebase:', error);
        }
    }

    info(message: string, meta?: any) {
        return this.log('INFO', message, meta);
    }
    
    error(message: string, meta?: any) {
        return this.log('ERROR', message, meta);
    }
}

export const logger = new Logger();