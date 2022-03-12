import { Context } from 'telegraf';
import { Keyboard } from '@/helpers/keyboard';

export async function replyWithItemsList(ctx: Context) {
    try {
        await ctx.answerCbQuery();

        const items = await ctx.itemClient.getAllItems();
        const userItems = await ctx.cartClient.getUserCart(ctx.from.id);

        let itemsTotalPrice = 0;

        if (userItems.length) {
            const { price: _itemsTotalPrice } = userItems.reduce((a, b) => {
                return { price: a.price + b.price };
            });

            itemsTotalPrice = _itemsTotalPrice;
        }

        return ctx.editMessageText(
            'Список товаров, которые Вы можете добавить в корзину.\n\n' +
            `Ваш баланс: <b>$${ctx.user.balance}</b>\n` +
            `Товаров в корзине: <b>${userItems.length}</b> <i>(на $${itemsTotalPrice})</i>`, {
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
        const userItems = await ctx.cartClient.getUserCart(ctx.from.id);
        const { price: itemsTotalPrice } = userItems.reduce((a, b) => {
            return { price: a.price + b.price };
        });

        return ctx.editMessageText(
            'Список товаров, которые Вы можете добавить в корзину.\n\n' +
            `Ваш баланс: <b>$${ctx.user.balance}</b>\n` +
            `Товаров в корзине: <b>${userItems.length}</b> <i>(на $${itemsTotalPrice})</i>`, {
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