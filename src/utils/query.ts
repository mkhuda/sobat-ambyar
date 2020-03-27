import * as mongo from './db';

export async function getSingleData() {
    await mongo.databaseConnect(async (err: any) => {
        if (err) console.log(`err`, err);
        const dbTest = mongo.getDB().collection('pantun');
        try {
            const allData = await dbTest.find().toArray();
            const lessCounter = allData.map((obj: any) => {
                return obj.count;
            }).sort()[0];
            const singleData = allData.filter((obj: any) => {
                return obj.count === lessCounter
            })[0];
            mongo.closeDB();
            return singleData;
        } catch (e) {
            throw e;
        }
    });
}