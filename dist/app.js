"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var slackWebApi_1 = require("./slackWebApi");
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var slackEventsApi = __importStar(require("@slack/events-api"));
var dotenv_1 = __importDefault(require("dotenv"));
var isDev = process.env.NODE_ENV !== "production";
isDev && dotenv_1.default.config();
var slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
var port = process.env.PORT || 3002;
var slackEvents = slackEventsApi.createEventAdapter(slackSigningSecret);
var app = express_1.default();
app.use("/slack/events", slackEvents.requestListener());
app.use(body_parser_1.default.urlencoded({ extended: false }));
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
    if (error.code === slackEventsApi.errorCodes.SIGNATURE_VERIFICATION_FAILURE) {
        console.error("An unverified request was sent to the Slack events Request URL. Request body: " + JSON.stringify(error.body));
    }
    else {
        console.error("An error occurred while handling a Slack event: " + error.message, error);
    }
});
http_1.default.createServer(app).listen(port, function () {
    console.log("server listening on port " + port);
});
