import { User } from '@/types/types';
import { CartClient, ItemClient, UserClient } from '@/helpers/database';

declare module 'telegraf' {
    export class Context {
        user: User;
        userClient: UserClient;
        itemClient: ItemClient;
        cartClient: CartClient;
    }
}
