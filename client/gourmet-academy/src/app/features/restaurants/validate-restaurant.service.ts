import { Injectable } from '@angular/core';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidateRestaurantService {

  constructor() { }

  validate(restaurantData: IRestaurant): { hasError: boolean, error: string, verifiedInput: IRestaurant } {
    const restaurantDataTrimmed = Object
      .entries(restaurantData)
      .reduce((acc, currentValue) => { // Trim user input
        currentValue[1] = typeof currentValue[1] === 'string'
          ? currentValue[1].trim()
          : currentValue[1]; // Check if the current value is string

        return Object.assign({ [currentValue[0]]: currentValue[1] }, acc); // Return object with assign current key values pair
      }, {}) as IRestaurant; // Saved like IRestaurant

    // Create an object to return checked restaurantData
    const result: { hasError: boolean, error: string, verifiedInput: IRestaurant } = {
      hasError: false,
      error: '',
      verifiedInput: restaurantDataTrimmed
    };

    // Validate User input for product data
    if (Object.values(result.verifiedInput).some(v => v === '')) {
      result.error = 'Всички полета са задължителни';

    } else if (result.verifiedInput.name.length < 2 || result.verifiedInput.name.length > 50) {
      result.error = 'Името трябва да бъде между 2 и 50 символа';

    } else if (result.verifiedInput.location.length < 2 || result.verifiedInput.location.length > 50) {
      result.error = 'Градът трябва да бъде между 2 и 50 символа';

    } else if (result.verifiedInput.address.length < 5 || result.verifiedInput.address.length > 100) {
      result.error = 'Адресът трябва да бъде между 5 и 100 символа';

    } else if (/^\+\d{3}\d{3}\d{3}\d{3}$/.test(result.verifiedInput.phone) === false) {
      result.error = 'Моля ползвайте следният формат +359111222333'

    } else if (result.verifiedInput.cuisine.length < 5 || result.verifiedInput.cuisine.length > 40) {
      result.error = 'Предлагана кухня трябва да бъде между 5 и 40 символа';

    } else if (result.verifiedInput.description.length < 5 || result.verifiedInput.description.length > 200) {
      result.error = 'Описанието трябва да бъде между 5 и 200 символа';

    } else if (/^https?:\/\/[^ ]+$/.test(result.verifiedInput.image) === false) {
      result.error = ' Снимката трябва да бъде линк започващ с http:// или https://';

    }

    if (result.error) {
      result.hasError = true;
    }

    return result;
  }

  // Check if the current html path is correct
  validateImagePath(imagePath: string): string {

    return /^https?:\/\/[^ ]+$/.test(imagePath) ? imagePath : '';
  }
}