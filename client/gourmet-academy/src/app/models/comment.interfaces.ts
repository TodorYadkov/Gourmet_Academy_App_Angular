import { IUser } from "./user.interfaces";

export interface IComment {
    _id: string;
    restaurantId: string;
    userId: IUser;
    comment: string;
};