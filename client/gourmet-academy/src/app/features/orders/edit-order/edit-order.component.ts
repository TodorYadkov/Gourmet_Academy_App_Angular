import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { translateErrorsFromServer } from 'src/app/core/environments/constants';
import { DataService } from 'src/app/core/services/data/data.service';
import { IOrderWithProducts } from 'src/app/models/order.interfaces';
import { IProduct } from 'src/app/models/product.interfaces';
import { IUser } from 'src/app/models/user.interfaces';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit, OnDestroy {

  @Input() userDetails!: IUser;
  @Input() userOrders!: IOrderWithProducts[];
  @Input() orderToEditId!: string;
  @Output() updateOrderList = new EventEmitter;

  successMessage!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  subscription!: Subscription;
  orderToEdit!: IOrderWithProducts;
  totalBillCost: number = 0; // Use to count total price
  summaryOrder: { product: IProduct, qtyProduct: number, totalPriceProduct: number }[] = []; // Use for summary bill

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Get order to edit
    const productToEditIndex = this.userOrders.findIndex(o => o._id === this.orderToEditId);
    if (productToEditIndex != -1) {
      this.orderToEdit = this.userOrders[productToEditIndex]; // Get current order to edit
      this.calculateBill();
    }
  }

  // Edit order
  updateOrder(formData: NgForm): void {
    const addressDelivery = formData.value.addressDelivery.trim();
    if (addressDelivery.length < 5 || addressDelivery.length > 100) {
      this.errorMsgFromServer = 'Адресът трбва да бъде с дължина между 5 и 100 символа';
      return;
    }

    // Create object needed to backend
    const orderData = {
      addressDelivery,
      orders: this.orderToEdit.orders.map(product => product._id), // Get only productId
      date: this.orderToEdit.date
    };

    this.isLoading = true;
    this.subscription = this.dataService
      .updateOrder(this.orderToEdit._id, orderData)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.successMessage = 'Успешно редактирана поръчка';
        },
        error: (error) => {
          this.errorMsgFromServer = translateErrorsFromServer.has(error.error.message)
            ? translateErrorsFromServer.get(error.error.message)
            : error.error.message; // Translate the error and if it is different from the current one, show it in English
          this.isLoading = false;
        }
      })
  }

  // On close modal
  onCloseModal(): void {
    this.updateOrderList.emit();
  }

  // Edit products quantity

  // Add more quantity for the selected product
  addMoreProduct(product: IProduct): void {
    const currentProductIndex = this.orderToEdit.orders.findIndex(p => p._id === product._id);
    this.orderToEdit.orders.splice(currentProductIndex, 0, product);
    // Calculate current bill
    this.calculateBill();
  }

  // Remove quantity for the selected product
  removeProduct(product: IProduct): void {
    const currentProductIndex = this.orderToEdit.orders.findIndex(p => p._id === product._id);
    if (currentProductIndex != -1) {
      // Remove product
      this.orderToEdit.orders.splice(currentProductIndex, 1);
      // Calculate current bill
      this.calculateBill();
    }
  }

  // Delete the selected product
  deleteProduct(product: IProduct): void {
    if (this.orderToEdit.orders.some(p => p._id === product._id)) {
      // Delete the current product by getting all except the current
      this.orderToEdit.orders = this.orderToEdit.orders.filter(p => p._id !== product._id);
      // Calculate current bill
      this.calculateBill();
    }
  }

  // Calculate user bill
  private calculateBill(): void {
    // Calculate only when the object has some property
    if (this.orderToEdit.orders.length !== 0) {
      // Get a summary details for each product
      const currentProductsDetails: { [_id: string]: { product: IProduct, quantity: number, price: number, totalCost: number } } = {};

      // For each product, create a new property with key _id and count the product
      this.orderToEdit.orders.forEach(productObj => {
        // Check if the product exist and if not add it with the necessary properties
        if (currentProductsDetails.hasOwnProperty(productObj._id) === false) {
          currentProductsDetails[productObj._id] = {
            product: productObj,
            quantity: 0,
            price: productObj.price,
            totalCost: 0
          };
        }
        // If the product exists - count it, and add current price
        currentProductsDetails[productObj._id].quantity += 1;
        currentProductsDetails[productObj._id].totalCost += productObj.price;
      });

      // Get needed data to show
      this.summaryOrder = Object.values(currentProductsDetails).map(product => {
        return {
          product: product.product,            // Get product
          qtyProduct: product.quantity,        // Get how many of the product were ordered
          totalPriceProduct: product.totalCost // Get total of current product
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };
}