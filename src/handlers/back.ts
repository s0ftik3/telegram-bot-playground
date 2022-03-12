import { Context } from 'telegraf';
import { Keyboard } from '@/helpers/keyboard';

export async function replyOnBackAction(ctx: Context) {
    try {
        await ctx.answerCbQuery();

        const itemsNumber = await ctx.cartClient.getUserCartSize(ctx.from.id);

        if (ctx.match.toString() === 'back') {
            return ctx.editMessageText(
                `Привет, <b>${ctx.user.first_name}</b>.\n\n` +
                'Это тестовый бот, демонстрирующий работу c такими инструментами как: TypeScript + Telegraf + PostgreSQL.\n\n' +
                'Вы можете добавить тестовые товары в корзину и посмотреть / купить их.', {
                    parse_mode: 'HTML',
                    reply_markup: Keyboard
                        .mainMenuKeyboard(itemsNumber)
                        .columns(2)
                        .draw()
                });
        } else {
            await ctx.deleteMessage();

            return ctx.replyWithHTML(
                `Привет, <b>${ctx.user.first_name}</b>.\n\n` +
                'Это тестовый бот, демонстрирующий работу c такими инструментами как: TypeScript + Telegraf + PostgreSQL.\n\n' +
                'Вы можете добавить тестовые товары в корзину и посмотреть / купить их.', {
                    reply_markup: Keyboard
                        .mainMenuKeyboard(+itemsNumber)
                        .columns(2)
                        .draw()
                });
        }
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}
