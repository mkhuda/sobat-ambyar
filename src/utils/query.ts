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
        connect.close()
        return gotData;
    } catch (e) {
        throw e;
    }
}