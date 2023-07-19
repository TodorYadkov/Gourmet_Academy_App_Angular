import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, mergeMap } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { Title } from '@angular/platform-browser';

import { IRestaurant } from 'src/app/models/restaurant.interfaces';
import { IUser } from 'src/app/models/user.interfaces';
import { IOrderWithProducts } from 'src/app/models/order.interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userDetails!: IUser;
  isRoleAdmin!: boolean; // Use to show admin profile page or user
  subscription!: Subscription;
  userRestaurants: IRestaurant[] = [];
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  statistics: { restaurantId: string, restaurantName: string, totalProfit: number, totalCountSell: number, bestSellers: string[] }[] = [];

  constructor(
    private title: Title,
    private dataService: DataService,
    private managerSession: ManagerSessionService
  ) { }


  ngOnInit(): void {
    this.title.setTitle('Профил');

    const hasUser = this.managerSession.getSessionToken();
    if (hasUser) {
      this.userDetails = hasUser.userDetails;
    }

    this.isRoleAdmin = this.managerSession.isUserRoleAdmin; // Check if the current user is admin
    if (hasUser && this.isRoleAdmin) {
      this.isLoading = true;
      this.subscription = this.dataService.getUserRestaurants(this.userDetails._id)
        .pipe(
          mergeMap(allRestaurants => allRestaurants),
          mergeMap(restaurant => {
            this.userRestaurants.push(restaurant);
            return this.dataService.getRestaurantOrders(restaurant._id)
              .pipe(
                mergeMap(order => {
                  // Create statistic object
                  const totalBills = order.map((order) => order.orders.reduce((acc, curPrice) => acc + curPrice.price, 0));
                  this.statistics.push({
                    restaurantId: restaurant._id,
                    restaurantName: restaurant.name,
                    totalProfit: totalBills.reduce((acc, bill) => acc + bill, 0),
                    totalCountSell: order.length,
                    bestSellers: this.findTopSellingProducts(order),
                  });

                  return this.statistics;
                })
              );
          }),
        )
        .subscribe({
          next: (data) => {
            // Show the restaurant with the most sales first
            this.statistics.sort((a, b) => b.totalProfit - a.totalProfit);
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMsgFromServer = error.error.message;
            this.isLoading = false;
          },
          complete: () => this.isLoading = false
        });
    }
  }

  // Get top selling products
  private findTopSellingProducts(allOrders: IOrderWithProducts[]): string[] {
    // Change if want to show more or less products
    const bestSellersCount = 5;

    // Count occurrences of each product
    const productCount: { [key: string]: number } = {};
    allOrders.forEach((currentOrder) => {
      currentOrder.orders.forEach((order) => {
        if (productCount[order.name]) {
          productCount[order.name]++;
        } else {
          productCount[order.name] = 1;
        }
      });
    });

    const countedProducts = Object.entries(productCount);
    countedProducts.sort((a, b) => b[1] - a[1]);
    // Extract the first best sellers
    const bestSellers = countedProducts
      .slice(0, bestSellersCount)
      .map((entry) => entry[0])
      .map((product) => `- ${product}`);

    return bestSellers;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}