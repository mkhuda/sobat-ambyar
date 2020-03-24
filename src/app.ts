import * as dotenv from "dotenv";
import { handleMessage, handleMention } from "./slackWebApi";
const { createEventAdapter } = require("@slack/events-api");

dotenv.config();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3002;

// Initialize the adapter to trigger listeners with envelope data and headers
const slackEvents: any = createEventAdapter(slackSigningSecret, {
  includeBody: true,
  includeHeaders: true
});

// Listeners now receive 3 arguments
slackEvents.on("message", (event, body, headers) => {
  handleMessage(event);
});

slackEvents.on("app_mention", (event, body, headers) => {
  handleMention(event);
});

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for events on ${server.address().port}`);
})();
