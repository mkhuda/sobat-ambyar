import * as mongo from './db';

export function singlePantun() {
    return mongo.databaseConnect(async (err: any) => {
        if (err) console.log(`err`, err);
        const dbTest = mongo.getDB().collection('pantun');
        try {
            const allData = await dbTest.find().toArray();
            const lessCounter = allData.map((obj: any) => {
                return obj.count;
            }).sort()[0];
            const singleData = allData.filter((obj: any) => {
                return obj.count == lessCounter
            });
            const gotData = singleData[Math.floor(Math.random() * singleData.length)];
            // mongo.closeDB();
            return gotData;
        } catch (e) {
            throw e;
        }
    });
}