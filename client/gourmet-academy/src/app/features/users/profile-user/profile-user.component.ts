import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IOrderSummary, IOrderWithProducts } from 'src/app/models/order.interfaces';
import { IUser } from 'src/app/models/user.interfaces';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {

  @Input() userDetails!: IUser;

  allSummaryOrders!: IOrderSummary[]; // Using to show summary information for each order
  isRoleAdmin!: boolean; // Use to show admin profile page or user
  subscription!: Subscription;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  userOrders!: IOrderWithProducts[];

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.getUserOrders();
  }

  // After delete-edit refresh the list of user orders
  refreshUserOrdersList(): void {
    this.getUserOrders();
  }

  // Get all user orders
  private getUserOrders(): void {
    this.isLoading = true;
    this.subscription = this.dataService.getUserBought(this.userDetails._id)
      .pipe(
        map(allOrders => {
          const resultSummaryOrder = allOrders.map(currentOrder => {
            // Create new temporary object to get summary for each product
            const currentProductDetails: { [key: string]: { image: string, name: string, weight: string, quantity: number, price: number, totalCost: number } } = {};

            // For each product, create a new property with key _id and count the product
            currentOrder.orders.forEach(orderObj => {
              // Check if the product exist and if not add it with the necessary properties
              if (currentProductDetails.hasOwnProperty(orderObj._id) === false) {
                currentProductDetails[orderObj._id] = {
                  image: orderObj.image,
                  name: orderObj.name,
                  weight: orderObj.weight,
                  quantity: 0,
                  price: orderObj.price,
                  totalCost: 0
                };
              }
              // If the product exists - count it, and add current price
              currentProductDetails[orderObj._id].quantity += 1;
              currentProductDetails[orderObj._id].totalCost += orderObj.price;
            });

            // Get details of the current restaurant where the order is from
            const currentOrderDetails = {
              _id: currentOrder._id,
              restaurantImage: currentOrder.restaurantId.image,
              restaurantName: currentOrder.restaurantId.name,
              restaurantLocation: currentOrder.restaurantId.location,
              restaurantAddress: currentOrder.restaurantId.address,
              restaurantPhone: currentOrder.restaurantId.phone,
              addressDelivery: currentOrder.addressDelivery,
              date: currentOrder.date,
              totalBillCost: currentOrder.orders.reduce((acc, currProduct) => { return acc + currProduct.price }, 0), // Get total cost for entire order
              canEdit: this.canEditDeleteOrder(currentOrder.date), // Check if the current order can be edited or deleted depending on the creation time (show/hide edit and delete buttons)
              products: Object.values(currentProductDetails) // Summary data for each product
            };

            // Return current order
            return currentOrderDetails;
          });
          // Get summary details for all products in descending order
          this.allSummaryOrders = resultSummaryOrder.sort((a, b) => b.date - a.date);

          return allOrders;
        })
      )
      .subscribe({
        next: (ordersData) => {
          this.isLoading = false;
          this.userOrders = ordersData;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      });
  }

  // Check if edit and delete time is allowed
  private canEditDeleteOrder(timestampCreated: number): boolean {
    const timestampNow = new Date().getTime(); // Get current time
    const timeIntervalInMilliseconds = 5 * 60 * 1000; // Convert 5 minutes to milliseconds
    const timeDifferenceInMilliseconds = timestampNow - timestampCreated; // Calculate difference in milliseconds

    if (timeDifferenceInMilliseconds <= timeIntervalInMilliseconds) {
      return true;
    }

    return false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

