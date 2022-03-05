import { Context } from 'telegraf';
import { createItemsKeyboard } from '@/helpers/keyboard';

export async function replyWithItemsList(ctx: Context) {
    try {
        await ctx.answerCbQuery();

        const items = await ctx.itemClient.getAllItems();
        const userItems = await ctx.userClient.getUserItems(ctx.from.id);

        return ctx.editMessageText(
            'Список товаров, которые Вы можете добавить в корзину.\n\n' +
            `Ваш баланс: <b>$${ctx.user.balance}</b>\n` +
            `Товаров в корзине: <b>${userItems.length}</b>`, {
                parse_mode: 'HTML',
                reply_markup: createItemsKeyboard(items)
            });
    } catch (err) {
        return ctx.replyWithHTML(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}

export async function replyOnAddToCartAction(ctx: Context) {
    try {
        const item = await ctx.itemClient.getItemBySlug(ctx.match[1]);

        await ctx.answerCbQuery('Добавлено в корзину');

        await ctx.cartClient.addItemToCart(+item.id, ctx.from.id);

        const items = await ctx.itemClient.getAllItems();
        const userItems = await ctx.userClient.getUserItems(ctx.from.id);

        return ctx.editMessageText(
            'Список товаров, которые Вы можете добавить в корзину.\n\n' +
            `Ваш баланс: <b>$${ctx.user.balance}</b>\n` +
            `Товаров в корзине: <b>${userItems.length}</b>`, {
                parse_mode: 'HTML',
                reply_markup: createItemsKeyboard(items)
            });
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}