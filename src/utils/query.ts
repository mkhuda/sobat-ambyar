import { ObjectId } from "mongodb";
import { IPantun } from '../interfaces/IPantun';
import { ISlackAuth } from '../interfaces/ISlackAuth';
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
        });
        return gotData;
    } catch (e) {
        throw e;
    }
}

export async function createSlackAuth(response: any) {
    const body = response.body;
    const data: ISlackAuth = {
        app_id: body.app_id,
        authed_user: body.authed_user.id,
        access_token: body.access_token,
        channel_id: body.incoming_webhook.channel_id,
        channel: body.incoming_webhook.channel,
        team_id: body.team.id,
        bot_user_id: body.bot_user_id,
    }
    try {
        const connect = await mongo.databaseConnect();
        const db = connect.db(process.env.MONGODB_DATABASE_NAME).collection('slack-bot-token');
        await db.findOneAndDelete({ channel_id: body.incoming_webhook.channel_id, team_id: body.team.id });
        await db.insertOne(data);
    } catch (e) {
        throw e
    }
}

export async function findBotToken(event: any) {
    try {
        const connect = await mongo.databaseConnect();
        const db = connect.db(process.env.MONGODB_DATABASE_NAME).collection('slack-bot-token');
        const findOne = db.findOne({ team_id: event.team })
        return findOne;
    } catch (e) {
        throw e
    }
}
