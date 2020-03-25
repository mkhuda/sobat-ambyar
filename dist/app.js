"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var slackWebApi_1 = require("./slackWebApi");
var http = require("http");
var express = require("express");
var slackEventsApi = require("@slack/events-api");
var slackValidateRequest = require("validate-slack-request");
dotenv.config();
var slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
var port = process.env.PORT || 3002;
// Initialize the adapter to trigger listeners with envelope data and headers
var slackEvents = slackEventsApi.createEventAdapter(slackSigningSecret, {
    includeBody: true,
    includeHeaders: true
});
var app = express();
app.use("/slack/events", slackEvents.expressMiddleware());
app.use(express.urlencoded({ extended: true }));
app.post("/", function (req, res, _next) {
    console.log("slackvalidate", process.env.SLACK_SIGNING_SECRET);
    if (slackValidateRequest(process.env.SLACK_SIGNING_SECRET, req)) {
        res.send("oke");
    }
    else {
        res.send("validate error");
    }
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
        console.error("An error occurred while handling a Slack event: " + error.message);
    }
});
http.createServer(app).listen(port, function () {
    console.log("server listening on port " + port);
});
