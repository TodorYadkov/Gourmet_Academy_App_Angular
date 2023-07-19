import { Component, Input } from '@angular/core';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';

@Component({
  selector: 'app-card-restaurant',
  templateUrl: './card-restaurant.component.html',
  styleUrls: ['./card-restaurant.component.css']
})
export class CardRestaurantComponent {
  @Input() restaurant!: IRestaurant;
  @Input() profile: boolean = false;
}
