import { WebClient } from "@slack/web-api";
import * as dotenv from "dotenv";

dotenv.config();

const web = new WebClient(process.env.BOT_TOKEN);

export function handleMessage(event) {
  console.log(`message`, event);
  const { text, channel, user, subtype } = event;
  const isNotEdited = subtype == undefined;
  const isUser = user !== "U010AK6U7QT";
  if (isNotEdited && isUser && text.includes("sobat ambyar")) {
    postMessage(
      channel,
      `Halo *sobat ambyar*, ada yang perlu dibanting? <@${user}>`
    );
  }
}

export function handleMention(event) {
  console.log(`event`, event);
  const { text, channel, user, edited } = event;
  const isNotEdited = edited == undefined;
  if (isNotEdited && text.includes(" pantun"))
    postMessage(channel, "Pantun apa ya?");
}

function postMessage(channel, text) {
  (async () => {
    try {
      await web.chat.postMessage({
        channel,
        text
      });
    } catch (error) {
      console.log(error);
    }
  })();
}
