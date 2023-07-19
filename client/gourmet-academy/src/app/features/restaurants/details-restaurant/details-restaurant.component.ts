import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, mergeMap } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IComment } from 'src/app/models/comment.interfaces';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';

@Component({
  selector: 'app-details-restaurant',
  templateUrl: './details-restaurant.component.html',
  styleUrls: ['./details-restaurant.component.css']
})
export class DetailsRestaurantComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  restaurantDetails!: IRestaurant;
  restaurantId!: string;
  isLoading: boolean = false;
  errorMsgFromServer!: string;
  allComments: IComment[] = [];

  constructor(
    private title: Title,
    private dataService: DataService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Детайли');
    // Get restaurant details
    this.getRestaurantDetails();
  }

  // Use when updating the restaurant to show new data
  refreshRestaurantDetails(): void {
    this.getRestaurantDetails();
  }

  // Get restaurant details
  private getRestaurantDetails(): void {
    this.restaurantId = this.activeRoute.snapshot.params['restaurantId']; // Get restaurant Id
    // Get restaurant details
    this.isLoading = true; // Show spinner
    this.subscription = this.dataService.getRestaurantById(this.restaurantId)
      .pipe(
        mergeMap(restaurant => {
          this.restaurantDetails = restaurant;
          return this.dataService.getAllCommentsRestaurant(restaurant._id)
            .pipe(
              mergeMap(comments => this.allComments = comments.slice(-5).reverse()) // Get last added five comment
            )
        })
      ).subscribe({
        next: (data) => this.isLoading = false,
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        },
        complete: () => this.isLoading = false,
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}