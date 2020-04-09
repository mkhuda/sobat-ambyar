import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import * as slackEventsApi from '@slack/events-api';
import * as request from 'superagent';
import hsp from 'heroku-self-ping';

import router from './rest';
import { conversationsJoin, handleMessage, handleMention } from './slack';
import * as query from './utils/query';

dotenv.config();

const slackSigningSecret: string = process.env.SLACK_SIGNING_SECRET || 'empty';
const port = process.env.PORT || 3002;
const usePing = process.env.USE_PING;

const slackEvents: any = slackEventsApi.createEventAdapter(slackSigningSecret);

const app = express();

app.use('/slack/events', slackEvents.requestListener());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v2', router);

app.get('/', (_req, res) => {
  res.sendStatus(200);
})
app.get('/slack-buttons', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/slack.html'));
});
app.get('/auth/redirect', (req, res) => {
  const uri = 'https://slack.com/api/oauth.v2.access?code='
    + req.query.code +
    '&client_id=' + process.env.SLACK_CLIENT_ID +
    '&client_secret=' + process.env.SLACK_CLIENT_SECRET +
    '&redirect_uri=' + process.env.SLACK_REDIRECT_URI

  request.post(uri, async (err, response) => {
    if (response.body.ok) {
      try {
        await query.createSlackAuth(response);
        await conversationsJoin(response.body.access_token, response.body.incoming_webhook.channel_id)
        res.redirect("https://slack.com/app_redirect?channel=" + response.body.incoming_webhook.channel_id)
      } catch (e) {
        throw e;
      };
    } else {
      console.log(err, response.body);
      res.send("Error authorization").status(200).end()
    }
  })
})
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
    console.error('An unverified request')
  } else {
    console.error(
      `An error occurred: ${error.message}`,
      error,
    );
  }
});

if (usePing == "1") hsp(process.env.APP_URL);

http.createServer(app).listen(port, () => {
  console.log(`server listening on ${port}`);
});
