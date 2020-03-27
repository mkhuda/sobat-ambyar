import * as mongo from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let _db: any;
export async function databaseConnect(callback: any): Promise<any> {
    const url: string = process.env.MONGODB_URI || 'mongo';
    try {
        mongo.connect(url, { useUnifiedTopology: true }, (err, client) => {
            _db = client.db(process.env.MONGODB_DATABASE_NAME);
            return callback(err)
        });
    } catch (err) {
        throw err.stack;
    }
}

export const getDB = () => _db;

export const closeDB = () => _db.close();