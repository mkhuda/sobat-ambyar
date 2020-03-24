<div align="center">
    
# Sobat Ambyar SlackBot

![SobatAmbyar](https://github.com/mkhuda/sobat-ambyar/raw/master/sobat-ambyar.png)

A super simple slackbot for ~manusia-manusia ambyar~.

<a href="https://slack.com/oauth/authorize?client_id=407013445267.723094934560&scope=bot"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

</div>

# Setup

### Clone the repository

```
git clone https://github.com/mkhuda/sobat-ambyar.git && cd inspireNuggetsSlackBot
```

### Install dependencies

```
npm install

npm start
```

### [Create a bot in Slack](https://api.slack.com/apps/AM92STGGG/general?) and generate and include your OAuth bot token

```
// Add this in your .env
BOT_TOKEN=YOUR_OWN_BOT_TOKEN
// Or using production ENV
```

```js
const bot = new SlackBot({
  token: `${process.env.BOT_TOKEN}`,
  name: "YOUR_OWN_APP_NAME"
});
```

## Author

[Muhammad K Huda](https://mkhuda.com)

## Licence

[MIT](https://opensource.org/licenses/MIT)
