import http from "http";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import * as slackEventsApi from "@slack/events-api";
import hsp from "heroku-self-ping";
import router from "./rest";
import auth_router from "./auth";
import { handleMessage, handleMention } from "./slack";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const usePing = process.env.USE_PING;
const slackSigningSecret: string = process.env.SLACK_SIGNING_SECRET || "empty";
const slackEvents: any = slackEventsApi.createEventAdapter(slackSigningSecret);

app.use("/slack/events", slackEvents.requestListener());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v2", router);
app.use("/auth", auth_router);

app.get("/", (_req, res) => {
  res.sendStatus(200);
});
app.get("/slack-buttons", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/slack.html"));
});
app.post("/slack/events", (req, res) => {
  const hasChallenge = req.body.challenge !== undefined;
  if (hasChallenge) {
    res.json({ challenge: req.body.challenge });
  }
});

slackEvents.on("message", (event: any, _body: any, _headers: any) => {
  handleMessage(event);
});
slackEvents.on("app_mention", (event: any, _body: any, _headers: any) => {
  handleMention(event);
});
slackEvents.on("error", (error: any) => {
  console.error("Event error", error.message);
});

if (usePing == "1") hsp(process.env.APP_URL);

http.createServer(app).listen(port, () => {
  console.log(`server listening on ${port}`);
});
