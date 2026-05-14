import { Injectable, computed, signal } from "@angular/core";
import { Product } from "../models/product.models";
import { OrderItemDTO } from "../models/order.models";
import { CartItem } from "../models/cart.models";

@Injectable({
    providedIn: 'root'
})

export class CartService{
    private _cartItems = signal<CartItem[]>([]);

    readonly cartItems = this._cartItems.asReadonly();

    readonly total = computed(() =>
        this._cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    );

    readonly itemCount = computed(() =>
        this._cartItems().reduce((count, item) => count + item.quantity, 0)
    );

    addItem(product: Product): void{
        this._cartItems.update(current => {
            const existing = current.find(item => item.product.id === product.id);
            if(existing){
                return current.map(item =>
                    item.product.id === product.id
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            }
            return [...current, {product, quantity: 1}];
        });
    }

    removeItem(productId: number): void{
        this._cartItems.update(current => current.filter(item => item.product.id !== productId));
    }

    getOrderItems(): OrderItemDTO[]{
        return this._cartItems().map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        }));
    }

    clear(): void{
        this._cartItems.set([]);
    }
}
