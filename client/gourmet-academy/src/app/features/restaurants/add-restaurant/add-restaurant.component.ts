import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';
import { ValidateRestaurantService } from '../validate-restaurant.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  errorMsgFromServer!: string;
  isLoading: boolean = false;

  constructor(
    private title: Title,
    private router: Router,
    private dataService: DataService,
    private validateRestaurant: ValidateRestaurantService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Ресторант');
  }

  createRestaurant(formData: NgForm): void {
    const userInput: IRestaurant = formData.value;
    // Validate user input
    const restaurantCheck = this.validateRestaurant.validate(userInput);
    if (restaurantCheck.hasError) {
      this.errorMsgFromServer = restaurantCheck.error;
      return;
    }

    this.isLoading = true;
    this.subscription = this.dataService.createRestaurant(restaurantCheck.verifiedInput)
      .subscribe({
        next: (data) => {
          formData.reset();
          this.isLoading = false;
          this.router.navigate(['details', data._id]);
        },
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}