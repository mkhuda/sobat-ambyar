import dotenv from "dotenv";
import { WebClient } from "@slack/web-api";
import * as query from "./utils/query";
import * as common from "./utils/common";

dotenv.config();

export async function handleMessage(event: any): Promise<void> {
  const { text, channel, user, subtype, thread_ts } = event;

  const isNotEdited = subtype === undefined;
  const maybeContainWords = common.contains(text);

  if (isNotEdited && maybeContainWords) {
    try {
      const pantun = await query.getSinglePantun();
      const botInfo = await query.findBotToken(event);
      const isNotBot = user != botInfo.bot_user_id;
      if (isNotBot)
        postMessage(
          botInfo.access_token,
          channel,
          "",
          common.buildTextBlocks(pantun.text),
          thread_ts
        );
    } catch (e) {
      throw e;
    }
  }
}

export async function handleMention(event: any): Promise<void> {
  const { text, edited } = event;
  const isNotEdited = edited === undefined;
  if (isNotEdited && text.includes(" pantun")) {
    try {
      const pantun = await query.getSinglePantun();
      // TODO: Handle Mention
      // await postMessage(channel, pantun.text);
      console.log(pantun.text);
    } catch (e) {
      throw e;
    }
  }
}

async function postMessage(
  token: string,
  channel: string,
  text: string,
  block?: Array<any>,
  thread_ts?: string | undefined
): Promise<void> {
  const web = new WebClient(token);
  try {
    await web.chat.postMessage({
      channel,
      text,
      blocks: block,
      thread_ts,
    });
  } catch (e) {
    throw e;
  }
}

export async function conversationsJoin(
  token: string,
  channel: string
): Promise<void> {
  const web = new WebClient(token);
  try {
    await web.conversations.join({ channel });
  } catch (e) {
    throw e;
  }
}
