import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnvironments } from 'src/app/models/environment.interfaces';
import { constants, endpoints } from '../../environments/constants';
import { IAllRestaurants, IRestaurant } from 'src/app/models/restaurant.interfaces';
import { IOrder, IOrderWithProducts } from 'src/app/models/order.interfaces';
import { IComment } from 'src/app/models/comment.interfaces';
import { IProduct } from 'src/app/models/product.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  // Get environment variable from server
  getAPIKeys(): Observable<IEnvironments> {
    const url = constants.hostBackEnd + endpoints.getApiKeys;
    return this.http.get<IEnvironments>(url);
  }
  //  Get all restaurant from server default with pagination
  getRestaurantsByPagination(page: string, limit: string): Observable<IAllRestaurants> {
    // --> Send with query - http://localhost:3000/restaurants?page=1&limit=6 : default values page: 1, limit: 6
    const url = constants.hostBackEnd + endpoints.getAllRestaurants(page, limit);
    return this.http.get<IAllRestaurants>(url);
  }
  // Get restaurants by search
  getRestaurantsBySearch(restaurantName: string, location: string): Observable<IRestaurant[]> {
    const url = constants.hostBackEnd + endpoints.getRestaurantsBySearch(restaurantName, location);
    return this.http.get<IRestaurant[]>(url);
  }
  // Create Restaurant
  createRestaurant(userInput: IRestaurant): Observable<IRestaurant> {
    const url = constants.hostBackEnd + endpoints.addNewRestaurant;
    return this.http.post<IRestaurant>(url, userInput);
  }
  // Update restaurant (edit)
  updateRestaurant(restaurantId: string, restaurantData: IRestaurant): Observable<IRestaurant> {
    const url = constants.hostBackEnd + endpoints.updateRestaurant(restaurantId);
    return this.http.put<IRestaurant>(url, restaurantData);
  }
  // Delete restaurant
  deleteRestaurant(restaurantId: string): Observable<IRestaurant> {
    const url = constants.hostBackEnd + endpoints.deleteRestaurant(restaurantId);
    return this.http.delete<IRestaurant>(url);
  }
  // Get usersRestaurants
  getUserRestaurants(userId: string): Observable<IRestaurant[]> {
    const url = constants.hostBackEnd + endpoints.getUserRestaurants(userId);
    return this.http.get<IRestaurant[]>(url);
  }
  // Get orders from restaurant
  getRestaurantOrders(restaurantId: string): Observable<IOrderWithProducts[]> {
    const url = constants.hostBackEnd + endpoints.getRestaurantOrders(restaurantId);
    return this.http.get<IOrderWithProducts[]>(url);
  }
  // Get restaurant by ID
  getRestaurantById(restaurantId: string): Observable<IRestaurant> {
    const url = constants.hostBackEnd + endpoints.getRestaurantById(restaurantId);
    return this.http.get<IRestaurant>(url);
  }
  // Create product
  createNewProduct(restaurantId: string, productData: IProduct): Observable<IProduct> {
    const url = constants.hostBackEnd + endpoints.addNewProduct(restaurantId);
    return this.http.post<IProduct>(url, productData);
  }
  // Get product by ID
  getProductById(productId: string): Observable<IProduct> {
    const url = constants.hostBackEnd + endpoints.getProductById(productId);
    return this.http.get<IProduct>(url);
  }
  // Get all products
  getAllProductsRestaurant(restaurantId: string): Observable<IProduct[]> {
    const url = constants.hostBackEnd + endpoints.getAllProductsRestaurant(restaurantId);
    return this.http.get<IProduct[]>(url);
  }
  // Update product (edit)
  updateProduct(productId: string, productData: IProduct): Observable<IProduct> {
    const url = constants.hostBackEnd + endpoints.updateProduct(productId);
    return this.http.put<IProduct>(url, productData);
  }
  // Delete product
  deleteProduct(productId: string): Observable<{ message: string, deletedProduct: IProduct }> {
    const url = constants.hostBackEnd + endpoints.deleteProduct(productId);
    return this.http.delete<{ message: string, deletedProduct: IProduct }>(url);
  }
  // Post new comment
  addNewComment(restaurantId: string, commentData: IComment): Observable<IComment> {
    const url = constants.hostBackEnd + endpoints.addNewComment(restaurantId);
    return this.http.post<IComment>(url, commentData);
  }
  // Update comment
  updateComment(commentId: string, commentData: IComment): Observable<IComment> {
    const url = constants.hostBackEnd + endpoints.updateComment(commentId);
    return this.http.put<IComment>(url, commentData);
  }
  // Delete comment
  deleteComment(commentId: string): Observable<{ message: string, deletedComment: IComment }> {
    const url = constants.hostBackEnd + endpoints.deleteComment(commentId);
    return this.http.delete<{ message: string, deletedComment: IComment }>(url);
  }
  // Get comment by ID
  getCommentById(commentId: string): Observable<IComment> {
    const url = constants.hostBackEnd + endpoints.getCommentById(commentId);
    return this.http.get<IComment>(url);
  }
  // Get restaurant comments
  getAllCommentsRestaurant(restaurantId: string): Observable<IComment[]> {
    const url = constants.hostBackEnd + endpoints.getAllCommentsRestaurant(restaurantId);
    return this.http.get<IComment[]>(url);
  }
  // Buy product (create new order)
  buyFromRestaurant(restaurantId: string, purchaseData: { addressDelivery: string, orders: string[], date: number }): Observable<{ addressDelivery: string, orders: string[], date: number }> {
    const url = constants.hostBackEnd + endpoints.buyFromRestaurant(restaurantId);
    return this.http.post<{ addressDelivery: string, orders: string[], date: number }>(url, purchaseData);
  }
  // Get user purchased products
  getUserBought(userId: string): Observable<IOrderWithProducts[]> {
    const url = constants.hostBackEnd + endpoints.getUserBought(userId);
    return this.http.get<IOrderWithProducts[]>(url);
  }
  // Update order
  updateOrder(orderId: string, orderData: { addressDelivery: string, orders: string[], date: number }): Observable<{ addressDelivery: string, orders: string[], date: number }> {
    const url = constants.hostBackEnd + endpoints.updateOrder(orderId);
    return this.http.put<{ addressDelivery: string, orders: string[], date: number }>(url, orderData);
  }
  // Delete order
  deleteOrder(orderId: string): Observable<IOrder> {
    const url = constants.hostBackEnd + endpoints.deleteOrder(orderId);
    return this.http.delete<IOrder>(url);
  }
}