import { ObjectId } from "mongodb";
import { IPantun } from '../interfaces/IPantun';
import * as mongo from './db';

export async function getSinglePantun() {
    try {
        const connect = await mongo.databaseConnect();
        const pantun = connect.db(process.env.MONGODB_DATABASE_NAME).collection('pantun');
        const allData = await pantun.find().toArray();
        const lessCounter = allData.map((obj: any) => {
            return obj.count;
        }).sort()[0];
        const singleData = allData.filter((obj: any) => {
            return obj.count == lessCounter
        });
        const gotData = singleData[Math.floor(Math.random() * singleData.length)];
        const updateData: IPantun = {
            ...gotData,
            count: Number(gotData.count + 1)
        }
        pantun.updateOne({ _id: new ObjectId(gotData._id) }, { $set: updateData }, (err: any, _r: any) => {
            if (err) throw err;
            connect.close();
        });
        return gotData;
    } catch (e) {
        throw e;
    }
}
