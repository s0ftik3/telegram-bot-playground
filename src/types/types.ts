export interface User {
    id: string
    first_name: string
    balance: number
}

export interface Item {
    id?: number
    title: string
    price: number
    slug: string
    duplicates?: number
}

export interface UserItem {
    id: number
    item_id: number
    user_id: number
}

export interface CartItem {
    id?: number
    title?: string
    slug?: string
    price: number
    item_id?: number
    user_id?: number
}