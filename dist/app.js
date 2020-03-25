"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slackWebApi_1 = require("./slackWebApi");
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var slackEventsApi = require("@slack/events-api");
var slackValidateRequest = require("validate-slack-request");
var isDev = process.env.NODE_ENV !== "production";
isDev && require("dotenv").config();
var slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
var port = process.env.PORT || 3002;
// Initialize the adapter to trigger listeners with envelope data and headers
var slackEvents = slackEventsApi.createEventAdapter(slackSigningSecret);
var app = express();
app.use("/slack/events", slackEvents.requestListener());
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/slack/events", function (req, res) {
    var hasChallenge = req.body.challenge !== undefined;
    hasChallenge && res.json({ challenge: req.body.challenge });
});
slackEvents.on("message", function (event, _body, _headers) {
    slackWebApi_1.handleMessage(event);
});
slackEvents.on("app_mention", function (event, _body, _headers) {
    slackWebApi_1.handleMention(event);
});
slackEvents.on("error", function (error) {
    if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
        console.error("An unverified request was sent to the Slack events Request URL. Request body: " + JSON.stringify(error.body));
    }
    else {
        console.error("An error occurred while handling a Slack event: " + error.message, error);
    }
});
http.createServer(app).listen(port, function () {
    console.log("server listening on port " + port);
});
