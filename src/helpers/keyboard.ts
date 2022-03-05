import { Markup } from 'telegraf';
import { CartItem, Item } from '@/types/types';

export function createMainMenuKeyboard(itemsNumber: number) {
    return Markup.inlineKeyboard([
        [
            Markup.callbackButton('Добавить', 'addItem'),
            Markup.callbackButton(`Корзина ${!itemsNumber ? '' : `(${itemsNumber})`}`, 'openCart')
        ],
        [
            Markup.callbackButton('Выдать себе денег', 'getCash')
        ]
    ]);
}

export function createItemsKeyboard(data: Item[]) {
    const buttons = data.map((e: Item) => {
        return Markup.callbackButton(`${e.title} · $${e.price}`, `addToCart:${e.slug}`);
    });

    return {
        inline_keyboard: [
            ...Markup.inlineKeyboard(buttons, { columns: 2 }).inline_keyboard,
            [Markup.callbackButton('‹ Назад', 'back')]
        ]
    };
}

export function createCartKeyboard(data: CartItem[], totalPrice: number) {
    const filteredItems = {};

    data.forEach((e) => {
        filteredItems[e.slug] = {
            title: e.title,
            price: e.price,
            slug: e.slug,
            duplicates: (filteredItems[e.slug]?.duplicates || 0) + 1
        }
    });

    const buttons = Object.values(filteredItems).map((e: Item) => {
        if (e.duplicates > 1) {
            return Markup.callbackButton(`${e.title} · ${e.duplicates}x · $${e.price}`, `deleteFromCart:${e.slug}`);
        }
        return Markup.callbackButton(`${e.title} · $${e.price}`, `deleteFromCart:${e.slug}`);
    });

    return {
        inline_keyboard: [
            ...Markup.inlineKeyboard(buttons, { columns: 2 }).inline_keyboard,
            [
                Markup.callbackButton(`Оплатить ($${totalPrice})`, `buy:${totalPrice}`),
                Markup.callbackButton(`Очистить`, 'clearCart')
            ],
            [Markup.callbackButton('‹ Назад', 'back')]
        ]
    };
}

export function createPaymentBackKeyboard() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('‹ Главное меню', 'backToMain')
    ]);
}