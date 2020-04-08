import express from 'express';
import * as mongo from './utils/db';
import { IPantun } from './interfaces/IPantun';

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const connect = await mongo.databaseConnect();
        const db = connect.db(process.env.MONGODB_DATABASE_NAME).collection('pantun');
        const allData = await db.find().toArray();
        res.json(allData);
    } catch (e) {
        throw e
    }
})

router.post('/create', async (req, res) => {
    const { text, language, count, code } = req.body;
    if (code !== process.env.ACCESS_CODE) res.sendStatus(500);
    const data: IPantun = {
        text, language, count: Number(count)
    }
    try {
        const connect = await mongo.databaseConnect();
        const db = connect.db(process.env.MONGODB_DATABASE_NAME).collection('pantun');
        const insertData = await db.insertOne(data);
        res.json(insertData);
    } catch (e) {
        throw e
    }
})

export = router;
