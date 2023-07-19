import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { constants } from 'src/app/core/environments/constants';
import { DataService } from 'src/app/core/services/data/data.service';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  subscription!: Subscription;
  allRestaurants: IRestaurant[] = [];
  foundRestaurants: IRestaurant[] = [];
  totalPages: number = 1;
  pageNumber: number = 1;
  pageArray!: number[];
  isSubmitedSearch: boolean = false;
  errorMsgFromServer!: string;

  constructor(
    private dataService: DataService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Начало');
    // Initialize the subscription to get one new instance and can add more observable
    this.subscription = new Subscription();
    // Initialize the home page with the first page and default limit
    this.getRestaurants(constants.defaultPaginationPageNum, constants.defaultPaginationLimitNum);
  }

  // Get Restaurants with pagination
  getRestaurants(page: string, limit: string) {
    // Show spinner
    this.isLoading = true;

    const observAllRestaurants$ = this.dataService.getRestaurantsByPagination(page, limit)
      .subscribe({
        next: (data) => {
          this.allRestaurants = data.restaurants;
          this.totalPages = data.totalPages;
          this.pageNumber = data.page;
          // Fill array with values, to have page numbers
          this.pageArray = Array(this.totalPages).fill(0).map((x, i) => i + 1);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        }
      });
    // Add current observable to subscription and on ngDestroy all observable to be destroyed
    this.subscription.add(observAllRestaurants$);
  }

  // Get restaurants by search
  onSearch(form: NgForm) {
    if (this.isValidForm(form)) {
      this.isLoading = true;
      const { restaurantName, location } = form.value;
      const observRestaurantBySearch$ = this.dataService.getRestaurantsBySearch(restaurantName, location)
        .subscribe({
          next: (data) => {
            this.foundRestaurants = data;
            this.isLoading = false;
            this.isSubmitedSearch = this.foundRestaurants.length === 0;
          },
          error: (error) => {
            this.errorMsgFromServer = error.error.message;
            this.isLoading = false;
          }
        });
      // Add current observable to subscribtion and on ngDestroy all observable to be destroyed
      this.subscription.add(observRestaurantBySearch$);
    }
  }

  // Display numbers - to pagination
  getVisiblePageNumbers(): number[] {
    let visiblePages = [];

    // Add current page
    visiblePages.push(this.pageNumber);

    // Calculate additional visible pages
    const maxVisiblePages = 5;
    const totalPages = this.totalPages;
    const currentPage = this.pageNumber;

    let pagesToAdd = maxVisiblePages - 1; // Subtract 1 for current page

    // Add pages before the current page
    for (let i = currentPage - 1; i >= 1 && pagesToAdd > 0; i--) {
      visiblePages.unshift(i);
      pagesToAdd--;
    }

    // Add pages after the current page
    for (let i = currentPage + 1; i <= totalPages && pagesToAdd > 0; i++) {
      visiblePages.push(i);
      pagesToAdd--;
    }

    return visiblePages;
  }

  //Go to specific page - from pagination
  goToPage(page: number): void {
    const pageToStr = String(page);
    this.getRestaurants(pageToStr, constants.defaultPaginationLimitNum);
  }

  // Check that the form is filled with at least one field
  isValidForm(form: NgForm): boolean {
    const restaurantName = form.value.restaurantName;
    const location = form.value.location;

    const isRestaurantNameValid = restaurantName && restaurantName.trim().length >= 1; // Check if name is filled and is at minimum 1 characters long
    const isLocationValid = location && location.trim().length >= 1; // Check if location is filled and is at minimum 1 characters long

    return isRestaurantNameValid || isLocationValid;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}