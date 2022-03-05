import { Pool } from 'pg';
import { CartItem, Item, User, UserItem } from '@/types/types';
import { config } from '@/config';

class Database {
    public pool: any;
    
    constructor() {
        this.pool = new Pool({
            user: config.user,
            password: config.password,
            host: config.host,
            port: config.port,
            database: config.database
        });
    }
}

export class UserClient extends Database {
    constructor() {
        super();
    }

    async findOrCreateUser(data: User): Promise<User> {
        const user = (await this.pool.query(`SELECT * FROM "Users" WHERE id = ${data.id};`)).rows;

        if (!user.length) {
            await this.pool.query(
                `INSERT INTO "Users" VALUES
                (${data.id}, ${data.balance}, '${data.first_name}')
                ON CONFLICT DO NOTHING;`
            );

            return {
                id: String(data.id),
                balance: data.balance,
                first_name: data.first_name
            };
        } else {
            return user[0];
        }
    }

    async changeUserBalance(userId: number, newBalance: number): Promise<void> {
        await this.pool.query(
            `UPDATE "Users"
            SET balance = ${newBalance}
            WHERE id = ${userId};`
        );
    }

    async depositUserBalance(userId: number, amount: number): Promise<void> {
        await this.pool.query(
            `UPDATE "Users"
            SET balance = balance + ${amount}
            WHERE id = ${userId};`
        );
    }

    async getUserItems(userId: number): Promise<UserItem[]> {
        return (await this.pool.query(`SELECT * FROM "UserItems" WHERE user_id = '${userId}';`)).rows;
    }

    async getUserCart(userId: number): Promise<CartItem[]> {
        return (await this.pool.query(
            `SELECT * FROM "Items" i
            INNER JOIN "UserItems" ui
            ON i.id = ui.item_id
            WHERE user_id = '${userId}';`
        )).rows;
    }
}

export class ItemClient extends Database {
    constructor() {
        super();
    }

    async getAllItems(): Promise<Item[]> {
        return (await this.pool.query('SELECT * FROM "Items";')).rows;
    }

    async getItemBySlug(slug: string): Promise<Item> {
        return (await this.pool.query(`SELECT * FROM "Items" WHERE slug = '${slug}';`)).rows[0];
    }

    async deleteAllItemsById(userId: number): Promise<void> {
        await this.pool.query(
            `DELETE FROM "UserItems"
            WHERE user_id = '${userId}';`
        );
    }
}

export class CartClient extends Database {
    constructor() {
        super();
    }

    async addItemToCart(itemId: number, userId: number): Promise<void> {
        await this.pool.query(
            `INSERT INTO "UserItems" (item_id, user_id) 
            VALUES (${itemId}, ${userId})
            ON CONFLICT DO NOTHING;`
        );
    }

    async deleteItemFromCartById(userId: number, itemId: number): Promise<void> {
        await this.pool.query(
            `DELETE FROM "UserItems"
            WHERE ctid IN (
                SELECT ctid
                FROM "UserItems"
                WHERE user_id = '${userId}'
                AND item_id = '${itemId}'
                LIMIT 1
            );`
        );
    }
}