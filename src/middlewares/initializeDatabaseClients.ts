import { Context } from 'telegraf';
import { CartClient, ItemClient, UserClient } from '@/helpers/database';

export async function initializeDatabaseClients(ctx: Context, next: () => void) {
    try {
        ctx.userClient = new UserClient();
        ctx.itemClient = new ItemClient();
        ctx.cartClient = new CartClient();

        return next();
    } catch (err) {
        return ctx.replyWithHTML(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}
