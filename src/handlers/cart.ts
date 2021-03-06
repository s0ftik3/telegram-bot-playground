import { Context } from 'telegraf';
import { Keyboard } from '@/helpers/keyboard';

export async function replyWithCart(ctx: Context) {
    try {
        const cartItems = await ctx.cartClient.getUserCart(ctx.from.id);

        if (!cartItems.length) {
            await ctx.answerCbQuery(
                'Ваша корзина пуста. Перейдите во вкладку «Добавить», чтобы заполнить её.',
                true
            );
        } else {
            await ctx.answerCbQuery();

            const { price: cartTotalPrice } = cartItems.reduce((a, b) => {
                return { price: a.price + b.price };
            });

            return ctx.editMessageText(
                `Ваш баланс: <b>$${ctx.user.balance}</b>\n\n` +
                `Чтобы удалить товар, нажмите на него один раз.`, {
                    parse_mode: 'HTML',
                    reply_markup: Keyboard
                        .cartKeyboard(cartItems)
                        .columns(2)
                        .addCartButtons(cartTotalPrice)
                        .addBackButton()
                        .draw()
                });
        }
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(
            `Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`,
            {
                parse_mode: 'HTML'
            }
        );
    }
}

export async function replyOnDeleteFromCartAction(ctx: Context) {
    try {
        const item = await ctx.itemClient.getItemBySlug(ctx.match[1]);

        await ctx.cartClient.deleteItemFromCart(ctx.from.id, item.id);

        const cartItems = await ctx.cartClient.getUserCart(ctx.from.id);

        if (!cartItems.length) {
            await ctx.answerCbQuery('Все товары были удалены из корзины');

            return ctx.editMessageText(
                `Привет, <b>${ctx.user.first_name}</b>.\n\n` +
                'Это тестовый бот, демонстрирующий работу c такими инструментами как: TypeScript + Telegraf + PostgreSQL.\n\n' +
                'Вы можете добавить тестовые товары в корзину и посмотреть / купить их.', {
                    parse_mode: 'HTML',
                    reply_markup: Keyboard
                        .mainMenuKeyboard(0)
                        .columns(2)
                        .draw()
                });
        } else {
            await ctx.answerCbQuery('Товар удалён из корзины');

            const { price: cartTotalPrice } = cartItems.reduce((a, b) => {
                return { price: a.price + b.price };
            });

            return ctx.editMessageReplyMarkup(
                Keyboard
                    .cartKeyboard(cartItems)
                    .columns(2)
                    .addCartButtons(cartTotalPrice)
                    .addBackButton()
                    .draw()
            );
        }
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}

export async function replyOnBuyAction(ctx: Context) {
    try {
        if (!(await ctx.cartClient.getUserCartSize(ctx.from.id))) {
            await ctx.answerCbQuery();

            await ctx.deleteMessage();

            return ctx.replyWithPhoto('https://http.cat/400', {
                caption: '❌ Оплата не была произведена, сумма не была списана со счёта. У Вас пустая корзина :/',
                reply_markup: Keyboard.paymentBackKeyboard().draw()
            });
        }

        if (ctx.user.balance >= +ctx.match[1]) {
            await ctx.answerCbQuery();

            await ctx.userClient.setUserBalance(ctx.from.id, ctx.user.balance - +ctx.match[1]);
            await ctx.cartClient.deleteAllItemsFromCart(ctx.from.id);

            await ctx.deleteMessage();

            return ctx.replyWithPhoto('https://http.cat/200', {
                caption: '✅ Оплата прошла успешно.',
                reply_markup: Keyboard.paymentBackKeyboard().draw()
            });
        } else {
            return ctx.answerCbQuery('Недостаточно средств на балансе :/', true);
        }
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}

export async function replyOnClearCartAction(ctx: Context) {
    try {
        await ctx.answerCbQuery('Корзина очищена');

        await ctx.cartClient.deleteAllItemsFromCart(ctx.from.id);

        return ctx.editMessageText(
            `Привет, <b>${ctx.user.first_name}</b>.\n\n` +
            'Это тестовый бот, демонстрирующий работу c такими инструментами как: TypeScript + Telegraf + PostgreSQL.\n\n' +
            'Вы можете добавить тестовые товары в корзину и посмотреть / купить их.', {
                parse_mode: 'HTML',
                reply_markup: Keyboard
                    .mainMenuKeyboard(0)
                    .columns(2)
                    .draw()
            });
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}