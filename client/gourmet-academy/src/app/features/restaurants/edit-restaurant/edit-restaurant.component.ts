import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';
import { ValidateRestaurantService } from '../validate-restaurant.service';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.css']
})
export class EditRestaurantComponent implements OnDestroy {

  @Input() restaurantDetails!: IRestaurant;
  @Output() restaurantUpdated = new EventEmitter;

  successMessage!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  subscription!: Subscription;
  imageUrl!: string;

  constructor(
    private dataService: DataService,
    private validateRestaurant: ValidateRestaurantService
  ) { }

  onEditRestaurant(formData: NgForm): void {
    const restaurantData: IRestaurant = formData.value;
    // Validate user input
    const restaurantCheck = this.validateRestaurant.validate(restaurantData);
    if (restaurantCheck.hasError) {
      this.errorMsgFromServer = restaurantCheck.error;
      return;
    }
    
    this.isLoading = true;
    this.subscription = this.dataService
      .updateRestaurant(this.restaurantDetails._id, restaurantCheck.verifiedInput)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.restaurantDetails = data;
          this.successMessage = `Успешно редактирахте ${data.name}`;
          this.restaurantUpdated.emit(); // Refresh data on details page
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      });
  }

  // Check if the current html path is correct
  validateImagePath(imagePath: string): void {
    this.imageUrl = this.validateRestaurant.validateImagePath(imagePath);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}