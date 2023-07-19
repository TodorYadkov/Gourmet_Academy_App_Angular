import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IProduct } from 'src/app/models/product.interfaces';
import { UpdateProductsListService } from '../update-products-list.service';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, OnDestroy {
  @Input() restaurantId!: string;

  isLoading: boolean = false;
  errorMsgFromServer!: string;
  subscription!: Subscription;
  allProducts!: IProduct[]; // All products from server
  isShownProducts: boolean = false; // Use in html to show product list if product list on initialization is null to hide all content
  // Use this for pagination and search
  currentProducts!: IProduct[]; // Current products on the page
  isFoundResult: boolean = false; // Use to show and hide a message if there are any products found or not
  productsPerPage = 10; // Number of products to display per page
  currentPage = 1; // Current page
  totalPages = 0; // Total number of pages
  pages: number[] = []; // Array of page numbers for rendering page numbers

  constructor(
    private dataService: DataService,
    private updateProductsList: UpdateProductsListService,
  ) { }

  ngOnInit(): void {
    // Get all products
    this.getAllProducts();
    // When receive new event update products
    this.subscribeToTriggerGetAllProducts()
  }

  // Pagination - Go to a desired page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.productToDisplay();
    }
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

  // Change current products to show
  changeProductsToShow(newValue: string): void {
    if (newValue) {
      const valueToNumber = Number(newValue);
      // Check if the value is -1 get all products, else current number of products
      this.productsPerPage = valueToNumber === -1 ? this.allProducts.length : valueToNumber;
    } else {
      // Set default value when the new value is empty string
      this.productsPerPage = 10;
    }

    // Set pagination options
    this.calculateTotalPages(this.allProducts.length);
    this.updatePageRange();
    this.productToDisplay();
    this.goToPage(1);
  }

  // Sort product by criteria
  sortProductsBy(criteria: string): void {
    if (criteria === '') {
      // Default sort
      this.currentProducts = [...this.allProducts];
      
    } else {
      // Sort by criteria
      const productToSort = [...this.allProducts]; // Get s new reference to all products
      this.currentProducts = productToSort.sort((a, b) => {
        if (criteria === 'name') {
          // Sort by name
          return a.name.localeCompare(b.name);
        } else if (criteria === 'group') {
          // Sort by group
          return a.group.localeCompare(b.group);
        } else if (criteria === 'priceASC') {
          // Sort by price ASC
          return a.price - b.price;
        } else if (criteria === 'priceDSC') {
          // Sort by price DSC
          return b.price - a.price;
        }

        return 0;
      });
    }
  }

  // Get all products for the current restaurant
  private getAllProducts(): void {
    this.isLoading = true;
    this.subscription = this.dataService
      .getAllProductsRestaurant(this.restaurantId).
      subscribe({
        next: (productsData) => {
          this.isLoading = false;
          this.allProducts = productsData;
          this.isShownProducts = this.allProducts.length !== 0;
          // Set pagination options
          this.calculateTotalPages(this.allProducts.length);
          this.updatePageRange();
          this.productToDisplay();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      });
  }

  // Pagination - Calculate total number of pages
  private calculateTotalPages(totalProducts: number): void {
    this.totalPages = Math.ceil(totalProducts / this.productsPerPage);
  }

  // Pagination - Create a new array with empty slots and add the page numbers from 1 to the number of pages
  private updatePageRange(): void {
    this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  // Pagination - Get products to show on screen
  private productToDisplay(): void {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.currentProducts = this.allProducts.slice(startIndex, endIndex);
  }

  // Subscribe to this event to update product list after CRUD - operation
  private subscribeToTriggerGetAllProducts(): void {
    this.updateProductsList.triggerGetAllProducts.subscribe(() => {
      this.getAllProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}