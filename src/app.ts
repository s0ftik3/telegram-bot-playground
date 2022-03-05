import 'module-alias/register';

import { bot } from '@/helpers/bot';
import { answerCbQuery } from '@/helpers/callback';

import { attachUser } from '@/middlewares/attachUser';
import { initializeDatabaseClients } from '@/middlewares/initializeDatabaseClients';

import {
    replyOnAddToCartAction,
    replyOnBackAction,
    replyOnBuyAction,
    replyOnClearCartAction,
    replyOnDeleteFromCartAction,
    replyWithCart,
    replyWithItemsList,
    replyOnGetCashAction,
    replyWithStart,
} from '@/handlers/index';

bot.use(initializeDatabaseClients);
bot.use(attachUser);

bot.start(replyWithStart);

bot.action(/addToCart:(.*)/, replyOnAddToCartAction);
bot.action(/deleteFromCart:(.*)/, replyOnDeleteFromCartAction);
bot.action(/buy:(.*)/, replyOnBuyAction);
bot.action('addItem', replyWithItemsList);
bot.action('openCart', replyWithCart);
bot.action('clearCart', replyOnClearCartAction);
bot.action('getCash', replyOnGetCashAction);
bot.action('back', replyOnBackAction);
bot.action('backToMain', replyOnBackAction);

bot.on('callback_query', answerCbQuery);

bot.catch(console.error);

bot.launch().then(() => {
    console.info(
        `[${bot.context.botInfo.first_name}] The bot has been started --> https://t.me/${bot.context.botInfo.username}`
    );
});
