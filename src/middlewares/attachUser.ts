import { Context } from 'telegraf';

export async function attachUser(ctx: Context, next: () => void) {
    try {
        const userData = {
            id: String(ctx.from.id),
            first_name: ctx.from.first_name.replace(/[<>]/g, ''),
            balance: 100
        };

        ctx.user = await ctx.userClient.findOrCreateUser(userData);

        return next();
    } catch (err) {
        return ctx.replyWithHTML(`Возникла непредвиденная ошибка.\n\n<i>${err.message}</i>`);
    }
}
