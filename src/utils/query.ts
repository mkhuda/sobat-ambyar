import * as mongo from './db';

export function getSingleData() {
    mongo.databaseConnect(async (err: any) => {
        if (err) console.log(`err`, err);
        const dbTest = mongo.getDB().collection('pantun');
        try {
            const allData = await dbTest.find().toArray();
            const lessCounter = allData.map((obj: any) => {
                Number(obj.count);
            }).sort()[0];
            console.log(lessCounter);
            const singleData = allData.filter((obj: any) => {
                obj.count == lessCounter
            })[0];
            console.log('singledata', singleData);
            mongo.closeDB();
            return singleData;
        } catch (e) {
            throw e;
        }
    });
}