import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IUser } from 'src/app/models/user.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidateUserService {

  constructor() { }

  // Validate user input on login
  loginValidate(formData: NgForm): { hasError: boolean, error: string, verifiedInput: { email: string, password: string } } {
    const userInputTrimmed = Object
      .entries(formData.value)
      .reduce((acc, currentValue) => { // Trim user input
        currentValue[1] = typeof currentValue[1] === 'string'
          ? currentValue[1].trim()
          : currentValue[1]; // Check if the current value is string

        return Object.assign({ [currentValue[0]]: currentValue[1] }, acc); // Return object with assign current key values pair
      }, {}) as { email: string, password: string };

    // Create an object to return checked userInput
    const result: { hasError: boolean, error: string, verifiedInput: { email: string, password: string } } = {
      hasError: false,
      error: '',
      verifiedInput: userInputTrimmed
    };

    // Validate user input
    if (Object.values(result.verifiedInput).some(v => v === '')) {
      result.error = 'Всички полета са задължителни';

    } else if (/^[\w]+@[\w]+\.[\w]+$/.test(result.verifiedInput.email) === false) {
      result.error = 'Въведеният имейл е невалиден';

    } else if (result.verifiedInput.password.length < 6) {
      result.error = 'Паролата трябва да бъде поне 6 символа';

    }

    if (result.error) {
      result.hasError = true;
    }

    return result;
  }

  // Validate usr input on register
  registerValidate(userInput: IUser, repass: string): { hasError: boolean, error: string, verifiedInput: IUser } {
    const userInputTrimmed = Object.entries(userInput)
      .reduce((acc, currentValue) => { // Trim user input
        currentValue[1] = typeof currentValue[1] === 'string'
          ? currentValue[1].trim()
          : currentValue[1]; // Check if the current value is string

        return Object.assign({ [currentValue[0]]: currentValue[1] }, acc); // Return object with assign current key values pair
      }, {}) as IUser; // Saved like IUser

    // Create an object to return checked userInput
    const result: { hasError: boolean, error: string, verifiedInput: IUser } = {
      hasError: false,
      error: '',
      verifiedInput: userInputTrimmed
    };
    // Validate user input
    if (Object.values(result.verifiedInput).some(v => v === '')) {
      result.error = 'Всички полета са задължителни';

    } else if (result.verifiedInput.name.length < 2 || result.verifiedInput.name.length > 30) {
      result.error = 'Името трябва да бъде между 2 и 30 символа';

    } else if (/^[\w]+@[\w]+\.[\w]+$/.test(result.verifiedInput.email) === false) {
      result.error = 'Въведеният имейл е невалиден';

    } else if (/^\+\d{3}\d{3}\d{3}\d{3}$/.test(result.verifiedInput.phone) === false) {
      result.error = 'Моля ползвайте следният формат +359111222333';

    } else if (result.verifiedInput.address.length < 5 || result.verifiedInput.address.length > 100) {
      result.error = 'Адресът трябва да бъде между 5 и 100 символа';

    } else if (result.verifiedInput.password.length < 6) {
      result.error = 'Паролата трябва да бъде поне 6 символа';

    } else if (result.verifiedInput.password != repass) {
      result.error = 'Паролите не съвпадат';

    } else if (['user', 'admin'].includes(result.verifiedInput.role) === false) {
      result.error = 'Невалиден статус на потребителя';

    } else if (result.verifiedInput.companyIdentificationNumber
      && /^(BG|bg)\d{9}$/.test(result.verifiedInput.companyIdentificationNumber) === false) {
      result.error = 'Моля ползвайте следният формат BG123456789';

    }

    if (result.error) {
      result.hasError = true;
    }

    return result;
  }
}