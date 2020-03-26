import * as mongo from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export async function databaseConnect(callback: any): Promise<any> {
    const url: string = process.env.MONGODB_URI || 'mongo';
    try {
        mongo.connect(url, (err, db) => {
            return callback(db, err)
        });
    } catch (err) {
        throw err.stack;
    }
}