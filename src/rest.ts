import express from 'express';
import MongoClient from 'mongodb';
import * as mongo from './utils/db';
import { IPantun } from './interfaces/IPantun';

const router = express.Router();

router.get('/', (_req, res) => {
    mongo.databaseConnect(async (err: any) => {
        if (err) console.log(`err`, err);
        const dbTest = mongo.getDB().collection('pantun');
        try {
            const allData = await dbTest.find().toArray();
            res.json(allData);
            mongo.closeDB();
        } catch (e) {
            throw e;
        }
    });
})

router.post('/create', (req, res) => {
    const { text, language, count, code } = req.body;
    if (code !== process.env.ACCESS_CODE) res.sendStatus(500);
    const data: IPantun = {
        text, language, count: Number(count)
    }
    mongo.databaseConnect(async (err: any) => {
        if (err) console.log(`err`, err);
        const dbTest = mongo.getDB().collection('pantun');
        try {
            const insertData = await dbTest.insertOne(data);
            res.json(insertData);
            mongo.closeDB();
        } catch (e) {
            throw e;
        }
    });
})

export = router;
