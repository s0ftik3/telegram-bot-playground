import { Pool } from 'pg';
import { CartItem, Item, User } from '@/types/types';
import { config } from '@/config';

class Database {
    public pool: Pool;

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

    async setUserBalance(userId: number | string, newBalance: number): Promise<void> {
        await this.pool.query(
            `UPDATE "Users"
            SET balance = ${newBalance}
            WHERE id = ${userId};`
        );
    }

    async depositToUserBalance(userId: number | string, amount: number): Promise<void> {
        await this.pool.query(
            `UPDATE "Users"
            SET balance = balance + ${amount}
            WHERE id = ${userId};`
        );
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
}

export class CartClient extends Database {
    constructor() {
        super();
    }

    async getUserCartSize(userId: number | string): Promise<number> {
        return (await this.pool.query(
            `SELECT COUNT(*)
            FROM "UserItems"
            WHERE user_id = '${userId}';`
        )).rows[0].count;
    }

    async getUserCart(userId: number | string): Promise<CartItem[]> {
        return (await this.pool.query(
            `SELECT * FROM "Items" i
            INNER JOIN "UserItems" ui
            ON i.id = ui.item_id
            WHERE user_id = '${userId}';`
        )).rows;
    }

    async addItemToCart(itemId: number, userId: number | string): Promise<void> {
        await this.pool.query(
            `INSERT INTO "UserItems" (item_id, user_id) 
            VALUES (${itemId}, ${userId})
            ON CONFLICT DO NOTHING;`
        );
    }

    async deleteItemFromCart(userId: number | string, itemId: number): Promise<void> {
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

    async deleteAllItemsFromCart(userId: number | string): Promise<void> {
        await this.pool.query(
            `DELETE FROM "UserItems"
            WHERE user_id = '${userId}';`
        );
    }
}