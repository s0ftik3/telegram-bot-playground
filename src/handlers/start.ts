import { Context } from 'telegraf';
import { Keyboard } from '@/helpers/keyboard';

export async function replyWithStart(ctx: Context) {
    try {
        const itemsNumber = await ctx.cartClient.getUserCartSize(ctx.from.id);

        return ctx.replyWithHTML(
            `Привет, <b>${ctx.user.first_name}</b>.\n\n` +
            'Это тестовый бот, демонстрирующий работу c такими инструментами как: TypeScript + Telegraf + PostgreSQL.\n\n' +
            'Вы можете добавить тестовые товары в корзину и посмотреть / купить их.', {
                reply_markup: Keyboard
                    .mainMenuKeyboard(+itemsNumber)
                    .columns(2)
                    .draw()
            }
        );
    } catch (err) {
        console.error(err);
        return ctx.replyWithHTML(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}
