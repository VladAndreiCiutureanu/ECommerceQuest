export interface OrderItemDTO{
    productId: number;
    quantity: number;
}

export interface CheckoutRequest{
    shippingAddress: string;
    items: OrderItemDTO[];
}

export interface OrderResponse{
    orderId: number;
    totalAmount: number;
    orderDate: string;
}