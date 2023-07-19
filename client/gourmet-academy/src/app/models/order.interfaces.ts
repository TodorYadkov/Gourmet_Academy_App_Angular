import { IProduct } from "./product.interfaces";
import { IRestaurant } from "./restaurant.interfaces";

export interface IOrder {
    _id: string;
    restaurantId: string;
    userId: string;
    addressDelivery: string;
    orders: string[];
    date: Date;
};

export interface IOrderWithProducts {
    _id: string;
    restaurantId: IRestaurant;
    userId: string;
    addressDelivery: string;
    orders: IProduct[];
    date: number;
};

// Summary for each order
export interface IOrderSummary {
    _id: string;
    restaurantImage: string;
    restaurantName: string;
    restaurantLocation: string;
    restaurantAddress: string;
    restaurantPhone: string;
    totalBillCost: number;
    addressDelivery: string;
    date: number;
    canEdit: boolean;
    products: {
      image: string;
      name: string;
      weight: string;
      quantity: number;
      price: number;
      totalCost: number;
    }[];
  };