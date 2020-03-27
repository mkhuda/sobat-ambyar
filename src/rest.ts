import express from 'express';
import * as mongo from './utils/db';

const router = express.Router();

router.get('/', (_req, res) => {
    mongo.databaseConnect(async (err: any) => {
        if (err) console.log(`err`, err);
        const dbTest = mongo.getDB().collection('pantun');
        try {
            const testList = await dbTest.find().toArray();
            res.json(testList);
            mongo.closeDB();
        } catch (e) {
            res.sendStatus(500);
            throw e;
        }
    });
})

export = router;
