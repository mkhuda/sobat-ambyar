import dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';
import * as query from './utils/query';
import * as common from './utils/common';

dotenv.config();

const web = new WebClient(process.env.BOT_TOKEN);

export async function handleMessage(event: any): Promise<void> {
  const { text, channel, user, subtype, thread_ts } = event;

  const isUser = user !== 'U010AK6U7QT';
  const isNotEdited = subtype === undefined;
  const maybeContainWords = common.contains(text);

  if (isNotEdited && isUser && maybeContainWords) {
    try {
      const pantun = await query.getSinglePantun();
      postMessage(channel, '', common.buildTextBlocks(pantun.text), thread_ts);
    } catch (e) {
      throw e;
    };
  }
}

export async function handleMention(event: any): Promise<void> {
  const { text, edited } = event;
  const isNotEdited = edited === undefined;
  if (isNotEdited && text.includes(' pantun')) {
    try {
      const pantun = await query.getSinglePantun();
      // TODO: Handle Mention
      // await postMessage(channel, pantun.text);
      console.log(pantun.text);
    } catch (e) {
      throw e;
    };
  }
}

async function postMessage(channel: string, text: string, block?: Array<any>, thread_ts?: string | undefined): Promise<void> {
  try {
    await web.chat.postMessage({
      channel,
      text,
      blocks: block,
      thread_ts
    });
  } catch (e) {
    throw e;
  }
}
