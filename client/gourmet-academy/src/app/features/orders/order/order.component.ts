import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { IProduct } from 'src/app/models/product.interfaces';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';
import { IUserToken } from 'src/app/models/user.interfaces';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  restaurantId!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  isFoundResult: boolean = false; // Use to show and hide a message if there are any products found or not
  hasUser!: boolean; // Check if current user is logged in
  isRoleAdmin!: boolean; // Check if the current user has an admin role if they are not banned from placing orders // TODO
  currentUser!: IUserToken | null; // Use for payment
  restaurantDetails!: IRestaurant; // Restaurant details
  allProducts!: IProduct[]; // Get all products and using with async pipe
  currentProducts!: IProduct[]; // This variable will be used to display products on the screen
  allOrderedProducts: { [key: string]: IProduct[] } = {}; // An object whose key is the name of the product and whose value is an array of objects of type IProduct
  allActiveGroups: Set<string> = new Set(); // Use to get all product groups of the current restaurant
  totalBillCost: number = 0; // Use to count total price
  summaryOrder: { product: IProduct, qtyProduct: number, totalPriceProduct: number }[] = []; // Use for summary bill

  constructor(
    private title: Title,
    private dataService: DataService,
    private managerSession: ManagerSessionService,
    private activeRoutes: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Поръчка');

    this.currentUser = this.managerSession.getSessionToken(); // Get current user
    this.hasUser = this.managerSession.hasUser; // Check if has logged in user
    this.restaurantId = this.activeRoutes.snapshot.params['restaurantId'];
    // Get details for restaurant
    this.isLoading = true;
    this.subscription = forkJoin([
      this.dataService.getRestaurantById(this.restaurantId),
      this.dataService.getAllProductsRestaurant(this.restaurantId)
    ]).subscribe({
      next: ([restaurantData, productsData]) => {
        this.isLoading = false;
        this.isRoleAdmin = this.managerSession.isUserRoleAdmin; // Check if current user has role admin
        this.restaurantDetails = restaurantData;
        this.allProducts = productsData;
        this.allProducts.forEach(p => this.allActiveGroups.add(p.group)); // Get only group name for current restaurant
        this.currentProducts = [...this.allProducts]; // Copy all products to new array
      },
      error: (error) => {
        this.errorMsgFromServer = error.error.message;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Order product
  orderProduct(product: IProduct): void {
    // Check if the current product exists in our order, if not we add it with empty array
    if (this.allOrderedProducts.hasOwnProperty(product._id) === false) {
      this.allOrderedProducts[product._id] = [];
    }
    // Add current order
    this.allOrderedProducts[product._id].push(product);
    // Calculate current bill
    this.calculateBill();
  }

  // Add more quantity for the selected product
  addMoreProduct(product: IProduct): void {
    if (this.allOrderedProducts[product._id]) {
      this.allOrderedProducts[product._id].push(product);
      // Calculate current bill
      this.calculateBill();
    }
  }

  // Remove quantity for the selected product
  removeProduct(product: IProduct): void {
    if (this.allOrderedProducts[product._id]) {
      // Remove last element
      this.allOrderedProducts[product._id].pop();

      if (this.allOrderedProducts[product._id].length === 0) {
        // If the array is empty delete current product
        this.deleteProduct(product);
      } else {
        // Calculate current bill
        this.calculateBill();
      }
    }
  }

  // Delete the selected product
  deleteProduct(product: IProduct): void {
    if (this.allOrderedProducts[product._id]) {
      delete this.allOrderedProducts[product._id];
      // Calculate current bill
      this.calculateBill();
    }
  }

  // Calculate user bill
  private calculateBill(): void {
    // Calculate only when the object has some property
    if (Object.keys(this.allOrderedProducts).length !== 0) {

      // Get each key for all order and create new object with required data
      this.summaryOrder = Object.keys(this.allOrderedProducts).map(key => {
        return {
          product: this.allOrderedProducts[key][0],          // Get product
          qtyProduct: this.allOrderedProducts[key].length,   // Get how many of the product were ordered
          totalPriceProduct: this.allOrderedProducts[key].reduce((acc, currValue) => { // Calculate total price for current product
            return acc + currValue.price;
          }, 0)
        };
      });

      // Calculate the total cost of the bill
      this.totalBillCost = this.summaryOrder.reduce((acc, value) => { return acc + value.totalPriceProduct }, 0)
    } else {
      // Delete all products
      this.summaryOrder = [];
      this.totalBillCost = 0;
    }
  }

  // Filter products by category
  filteredByCategory(categoryName: string): void {
    this.currentProducts = categoryName !== ''
      ? this.allProducts.filter(product => product.group === categoryName)
      : this.allProducts.slice();
  }

  // Search product by name and price
  onSearch(searchStr: string): void {
    if (isNaN(Number(searchStr))) {
      // Search by name
      this.currentProducts = this.allProducts.filter(product => product.name.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()));
    } else {
      // Search by price
      this.currentProducts = this.allProducts.filter(product => product.price.toString().includes(searchStr));
    }

    // If the found result is true show message - No products found
    this.isFoundResult = this.currentProducts.length === 0;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}