<div align="center">
    
# Sobat Ambyar SlackBot

![SobatAmbyar](https://avatars.slack-edge.com/2020-03-24/1023381274981_cddb07dd666086c15004_192.png)

A super simple slackbot for ~manusia-manusia ambyar~.

<a href="https://slack.com/oauth/v2/authorize?client_id=39335778578.1022083833296&scope=app_mentions:read,channels:join,chat:write,chat:write.customize,chat:write.public,incoming-webhook,channels:read,channels:history"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

</div>

# Setup

### Clone the repository

```
git clone https://github.com/mkhuda/sobat-ambyar.git && cd sobat-ambyar
```

### Install dependencies

```
npm install

npm start
```

### [Create a Slack App](https://api.slack.com/apps/new) and generate and include your OAuth bot token

```
// Add this in your .env
PORT=3002
USE_PING=0
APP_URL=https://your-app-com-or-herokuapp.com/
SLACK_CLIENT_ID=xxxxxxxx.xxxxx
SLACK_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxx
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxx
BOT_TOKEN=xoxb-xxxxxxxxxxxxxxxxxx
MONGODB_DATABASE_NAME=xxxxxxxxxxx
MONGODB_URI=mongodb://xxxxxxxxxxxxxxxx
// Or using production ENV
```

## Author

[Muhammad K Huda](https://mkhuda.com)

## Licence

[MIT](https://opensource.org/licenses/MIT)
