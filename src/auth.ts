import express from "express";
import * as request from "superagent";
import * as query from "./utils/query";
import { conversationsJoin } from "./slack";

const auth_router = express.Router();

auth_router.get("/redirect", async (req, res) => {
  const uri =
    "https://slack.com/api/oauth.v2.access?code=" +
    req.query.code +
    "&client_id=" +
    process.env.SLACK_CLIENT_ID +
    "&client_secret=" +
    process.env.SLACK_CLIENT_SECRET +
    "&redirect_uri=" +
    process.env.SLACK_REDIRECT_URI;

  request.post(uri, async (err, response) => {
    if (response.body.ok) {
      try {
        await query.createSlackAuth(response);
        await conversationsJoin(
          response.body.access_token,
          response.body.incoming_webhook.channel_id
        );
        res.redirect(
          "https://slack.com/app_redirect?channel=" +
            response.body.incoming_webhook.channel_id
        );
      } catch (e) {
        throw e;
      }
    } else {
      console.log(err, response.body);
      res.send("Error authorization").status(200).end();
    }
  });
});

export = auth_router;
