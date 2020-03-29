import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as slackEventsApi from '@slack/events-api';
import router from './rest';
import { handleMessage, handleMention } from './slackWebApi';
import hsp from 'heroku-self-ping';

dotenv.config();

const slackSigningSecret: string = process.env.SLACK_SIGNING_SECRET || 'empty';
const port = process.env.PORT || 3002;
const usePing = process.env.USE_PING;

const slackEvents: any = slackEventsApi.createEventAdapter(slackSigningSecret);

const app = express();

app.use('/slack/events', slackEvents.requestListener());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.sendStatus(200);
})
app.use('/api/v2', router);
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

if (usePing == "1") hsp(process.env.APP_URL);

http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
