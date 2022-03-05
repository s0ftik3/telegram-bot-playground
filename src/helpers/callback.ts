import { Context } from 'telegraf';

export function answerCbQuery(ctx: Context) {
    try {
        return ctx.answerCbQuery();
    } catch (err) {
        return ctx.replyWithHTML(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}
