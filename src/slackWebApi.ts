import dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';
import * as query from './utils/query';
const isDev = process.env.NODE_ENV !== 'production';
if (isDev) {
  dotenv.config();
}

const web = new WebClient(process.env.BOT_TOKEN);

export function handleMessage(event: any): void {
  const { text, channel, user, subtype } = event;
  const isNotEdited = subtype === undefined;
  const isUser = user !== 'U010AK6U7QT';
  if (isNotEdited && isUser && text.includes('sobat ambyar')) {
    postMessage(
      channel,
      `Halo *sobat ambyar*, ada yang perlu dibanting? <@${user}>`
    );
  }
}

export async function handleMention(event: any): Promise<void> {
  const { text, channel, edited } = event;
  const isNotEdited = edited === undefined;
  if (isNotEdited && text.includes(' pantun')) {
    try {
      const pantun = await query.getSinglePantun();
      await postMessage(channel, pantun.text);
    } catch (e) {
      throw e;
    };
  }
}

async function postMessage(channel: string, text: string): Promise<void> {
  try {
    await web.chat.postMessage({
      channel,
      text
    });
  } catch (e) {
    throw e;
  }
}
