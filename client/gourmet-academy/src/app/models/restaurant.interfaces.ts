import { IUser } from "./user.interfaces";

export interface IRestaurant {
    _id: string;
    name: string;
    location: string;
    address: string;
    phone: string;
    cuisine: string;
    description: string;
    image: string;
    owner: IUser
}

export interface IAllRestaurants {
    restaurants: IRestaurant[],
    page: number;
    totalPages: number;
}