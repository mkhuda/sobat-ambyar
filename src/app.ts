import { handleMessage, handleMention } from "./slackWebApi";
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const slackEventsApi = require("@slack/events-api");
const slackValidateRequest = require("validate-slack-request");

let isDev = process.env.NODE_ENV !== "production";
isDev && require("dotenv").config();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3002;

// Initialize the adapter to trigger listeners with envelope data and headers
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
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${JSON.stringify(error.body)}`);
  } else {
    console.log(`node_env`, process.env.NODE_ENV, slackSigningSecret);
    console.error(
      `An error occurred while handling a Slack event: ${error.message}`,
      error
    );
  }
});

http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
