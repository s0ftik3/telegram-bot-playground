import { CartItem, Item } from '@/types/types';
import { InlineKeyboardMarkup, InlineKeyboardButton } from 'typegram/inline';

export class Keyboard {
    public buttons: InlineKeyboardButton[];
    public markupButtons: InlineKeyboardButton[][];

    constructor() {
        this.buttons = [];
        this.markupButtons = [];
    }

    draw(): InlineKeyboardMarkup {
        return <InlineKeyboardMarkup>{
            inline_keyboard: this.markupButtons
        }
    }

    columns(value: number) {
        this.markupButtons = this.buttons.reduce((result, item, index) => {
            const chunkIndex = Math.floor(index / value);

            if(!result[chunkIndex]) {
                result[chunkIndex] = [];
            }

            result[chunkIndex].push(item);

            return result;
        }, []);

        return this;
    }

    mainMenuKeyboard(itemsNumber?: number) {
        this.buttons = [
            { text: 'Добавить', callback_data: 'addItem' },
            { text: `Корзина ${!itemsNumber ? '' : `(${itemsNumber})`}`, callback_data: 'openCart' },
            { text: 'Выдать себе денег', callback_data: 'getCash' }
        ];

        this.markupButtons = [this.buttons];

        return this;
    }

    itemsKeyboard(data: Item[]) {
        this.buttons = data.map((e: Item) => {
            return { text: `${e.title} · $${e.price}`, callback_data: `addToCart:${e.slug}` };
        });

        this.markupButtons = [this.buttons];

        return this;
    }

    cartKeyboard(data: CartItem[]) {
        const filteredItems = {};

        data.forEach((e) => {
            filteredItems[e.slug] = {
                title: e.title,
                price: e.price,
                slug: e.slug,
                duplicates: (filteredItems[e.slug]?.duplicates || 0) + 1
            }
        });

        this.buttons = Object.values(filteredItems).map((e: Item) => {
            if (e.duplicates > 1) {
                return { text: `${e.title} · ${e.duplicates}x · $${e.price}`, callback_data: `deleteFromCart:${e.slug}` };
            }
            return { text: `${e.title} · $${e.price}`, callback_data: `deleteFromCart:${e.slug}` };
        });

        this.markupButtons = [this.buttons];

        return this;
    }

    paymentBackKeyboard() {
        this.markupButtons = [[
            { text: '‹ Главное меню', callback_data: 'backToMain' }
        ]];

        return this;
    }

    addCartButtons(totalPrice?: number) {
        this.markupButtons.push(            [
            { text: `Оплатить ($${totalPrice})`, callback_data: `buy:${totalPrice}` },
            { text: `Очистить`, callback_data: 'clearCart' }
        ])

        return this;
    }

    addBackButton() {
        this.markupButtons.push([
            { text: '‹ Назад', callback_data: 'back' }
        ])

        return this;
    }

    static draw() {
        return new Keyboard().draw();
    }

    static columns(value: number) {
        return new Keyboard().columns(value);
    }

    static mainMenuKeyboard(itemsNumber?: number) {
        return new Keyboard().mainMenuKeyboard(itemsNumber);
    }

    static itemsKeyboard(data: Item[]) {
        return new Keyboard().itemsKeyboard(data);
    }

    static cartKeyboard(data: CartItem[]) {
        return new Keyboard().cartKeyboard(data);
    }

    static paymentBackKeyboard() {
        return new Keyboard().paymentBackKeyboard();
    }

    static addCartButtons(totalPrice?: number) {
        return new Keyboard().addCartButtons(totalPrice);
    }

    static addBackButton() {
        return new Keyboard().addBackButton();
    }
}