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

export function handleMention(event: any): void {
  const { text, channel, edited } = event;
  const isNotEdited = edited === undefined;
  if (isNotEdited && text.includes(' pantun')) {
    const data: any = query.singlePantun();
    console.log(data);
    postMessage(channel, data.text);
  }
}

function postMessage(channel: string, text: string): void {
  (async (): Promise<void> => {
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
