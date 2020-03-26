import { handleMessage, handleMention } from './slackWebApi';
import * as mongo from './utils/db';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import * as slackEventsApi from '@slack/events-api';
import dotenv from 'dotenv';

dotenv.config();

mongo.databaseConnect(async (err: any) => {
  if (err) console.log(`err`, err);
  const db = await mongo.getDB();
  console.log(db)
  const dbTest = await db.collection('pantun');
  try {
    const testList = await dbTest.find().toArray();
    console.log(testList);
  } catch (e) {
    throw e;
  }
});

const slackSigningSecret: string = process.env.SLACK_SIGNING_SECRET || 'empty';
const port = process.env.PORT || 3002;

const slackEvents: any = slackEventsApi.createEventAdapter(slackSigningSecret);

const app = express();

app.use('/slack/events', slackEvents.requestListener());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/slack/events', (req, res) => {
  const hasChallenge = req.body.challenge !== undefined;
  if (hasChallenge) { res.json({ challenge: req.body.challenge }); }
});

slackEvents.on('message', (event: any, _body: any, _headers: any) => {
  handleMessage(event);
});

slackEvents.on('app_mention', (event: any, _body: any, _headers: any) => {
  handleMention(event);
});

slackEvents.on('error', (error: any) => {
  if (error.code === slackEventsApi.errorCodes.SIGNATURE_VERIFICATION_FAILURE) {
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${JSON.stringify(error.body)}`);
  } else {
    console.error(
      `An error occurred while handling a Slack event: ${error.message}`,
      error,
    );
  }
});

http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
