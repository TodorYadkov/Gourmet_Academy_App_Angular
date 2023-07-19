import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';

@Component({
  selector: 'app-delete-restaurant',
  templateUrl: './delete-restaurant.component.html',
  styleUrls: ['./delete-restaurant.component.css']
})
export class DeleteRestaurantComponent {

  @Input() restaurantDetails!: IRestaurant;

  successMessage!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  disableBtnDelete: boolean = false;
  subscription!: Subscription;

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  // Delete current restaurant
  deleteRestaurant(restaurantId: string): void {
    this.isLoading = true;
    this.subscription = this.dataService
      .deleteRestaurant(restaurantId)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.disableBtnDelete = true;
          this.successMessage = `Успешно изтрихте ресторант ${this.restaurantDetails.name}`;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      })
  };

  // On close redirect to profile page
  onCloseModal(): void {
    if (this.successMessage) {
      this.router.navigate(['profile'])
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };
}