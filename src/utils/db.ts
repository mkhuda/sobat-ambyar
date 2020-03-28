import * as mongo from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export async function databaseConnect(): Promise<any> {
    const url: string = process.env.MONGODB_URI || 'mongo';
    try {
        const connect = await mongo.connect(url, { useUnifiedTopology: true });
        return connect;
    } catch (err) {
        throw err.stack;
    }
}