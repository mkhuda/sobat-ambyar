import { handleMessage, handleMention } from "./slackWebApi";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import * as slackEventsApi from "@slack/events-api";
import dotenv from "dotenv";

let isDev = process.env.NODE_ENV !== "production";
isDev && dotenv.config();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3002;

const slackEvents: any = slackEventsApi.createEventAdapter(slackSigningSecret);

const app = express();

app.use("/slack/events", slackEvents.requestListener());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/slack/events", (req, res) => {
  const hasChallenge = req.body.challenge !== undefined;
  hasChallenge && res.json({ challenge: req.body.challenge });
});

slackEvents.on("message", (event, _body, _headers) => {
  handleMessage(event);
});

slackEvents.on("app_mention", (event, _body, _headers) => {
  handleMention(event);
});

slackEvents.on("error", error => {
  if (error.code === slackEventsApi.errorCodes.SIGNATURE_VERIFICATION_FAILURE) {
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${JSON.stringify(error.body)}`);
  } else {
    console.error(
      `An error occurred while handling a Slack event: ${error.message}`,
      error
    );
  }
});

http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
