export interface Order {
    id: number;
    orderName: string;
    price: number;
    // discounted: string;
    isDiscountPercentage: number;
}