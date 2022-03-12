import { Telegraf } from 'telegraf';
import { config } from '@/config';

export const bot = new Telegraf(config.token, { handlerTimeout: 100 });
