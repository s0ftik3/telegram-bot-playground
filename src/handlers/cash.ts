import { Context } from 'telegraf';

export async function replyOnGetCashAction(ctx: Context) {
    try {
        let randomCashNumber = Math.floor(Math.random() * 500) + 1;

        if (ctx.user.balance >= 1000) {
            return ctx.answerCbQuery(`У Вас уже достаточно денег. Перейдите во вкладку «Добавить», чтобы потратить их.`, true);
        }

        if (ctx.user.balance + randomCashNumber > 1000) {
            randomCashNumber = 1000 - ctx.user.balance;
        }

        await ctx.userClient.depositToUserBalance(ctx.from.id, randomCashNumber);

        return ctx.answerCbQuery(`Ваш баланс был пополнен на $${randomCashNumber}.`, true);
    } catch (err) {
        await ctx.answerCbQuery();

        return ctx.editMessageText(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}