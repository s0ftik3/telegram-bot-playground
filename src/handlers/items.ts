import { Context } from 'telegraf';
import { Keyboard } from '@/helpers/keyboard';

export async function replyWithItemsList(ctx: Context) {
    try {
        await ctx.answerCbQuery();

        const items = await ctx.itemClient.getAllItems();
        const userItemsNumber = await ctx.cartClient.getUserCartSize(ctx.from.id);

        return ctx.editMessageText(
            'Список товаров, которые Вы можете добавить в корзину.\n\n' +
            `Ваш баланс: <b>$${ctx.user.balance}</b>\n` +
            `Товаров в корзине: <b>${userItemsNumber}</b>`, {
                parse_mode: 'HTML',
                reply_markup: Keyboard
                    .itemsKeyboard(items)
                    .columns(2)
                    .addBackButton()
                    .draw()
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
        const userItemsNumber = await ctx.cartClient.getUserCartSize(ctx.from.id);

        return ctx.editMessageText(
            'Список товаров, которые Вы можете добавить в корзину.\n\n' +
            `Ваш баланс: <b>$${ctx.user.balance}</b>\n` +
            `Товаров в корзине: <b>${userItemsNumber}</b>`, {
                parse_mode: 'HTML',
                reply_markup: Keyboard
                    .itemsKeyboard(items)
                    .columns(2)
                    .addBackButton()
                    .draw()
            });
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}