import { Injectable } from '@angular/core';
import { IProduct } from 'src/app/models/product.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidateProductService {

  constructor() { }

  validate(productData: IProduct): { hasError: boolean, error: string, verifiedInput: IProduct } {
    const productDataTrimmed = Object
      .entries(productData)
      .reduce((acc, currentValue) => { // Trim user input
        currentValue[1] = typeof currentValue[1] === 'string'
          ? currentValue[1].trim()
          : currentValue[1]; // Check if the current value is string

        return Object.assign({ [currentValue[0]]: currentValue[1] }, acc); // Return object with assign current key values pair
      }, {}) as IProduct; // Saved like IProduct

    // Create an object to return checked productData
    const result: { hasError: boolean, error: string, verifiedInput: IProduct } = {
      hasError: false,
      error: '',
      verifiedInput: productDataTrimmed
    };
    // Validate User input for product data
    if (Object.values(result.verifiedInput).some(v => v === '')) {
      result.error = 'Всички полета са задължителни';

    } else if (result.verifiedInput.name.length < 3 || result.verifiedInput.name.length > 100) {
      result.error = 'Името на продукта трябва да бъде между 3 и 100 символа';

    } else if (result.verifiedInput.weight.length < 2 || result.verifiedInput.weight.length > 10) {
      result.error = 'Мярката трябва да бъде между 2 и 10 символа';

    } else if (isNaN(Number(result.verifiedInput.price)) || Number(result.verifiedInput.price) < 0) {
      result.error = 'Моля въведете коректна цена'

    } else if (result.verifiedInput.group.length < 3 || result.verifiedInput.group.length > 20) {
      result.error = 'Групата трябва да бъде между 3 и 20 символа';

    } else if (/^https?:\/\/[^ ]+$/.test(result.verifiedInput.image) === false) {
      result.error = 'Снимката трябва да бъде линк започващ с http:// или https://'
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
