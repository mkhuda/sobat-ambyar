import * as dotenv from "dotenv";
import { handleMessage, handleMention } from "./slackWebApi";
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const slackEventsApi = require("@slack/events-api");

dotenv.config();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3002;

// Initialize the adapter to trigger listeners with envelope data and headers
const slackEvents: any = slackEventsApi.createEventAdapter(slackSigningSecret, {
  includeBody: true,
  includeHeaders: true
});

const app = express();

app.use("/slack/events", slackEvents.expressMiddleware());

// Listeners now receive 3 arguments
slackEvents.on("message", (event, body, headers) => {
  handleMessage(event);
});

slackEvents.on("app_mention", (event, body, headers) => {
  handleMention(event);
});

slackEvents.on("error", error => {
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${JSON.stringify(error.body)}`);
  } else {
    console.error(
      `An error occurred while handling a Slack event: ${error.message}`
    );
  }
});

http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
