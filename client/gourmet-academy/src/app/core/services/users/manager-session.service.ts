import { Injectable } from '@angular/core';
import { IUserToken } from 'src/app/models/user.interfaces';
import { constants } from '../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class ManagerSessionService {

  constructor() { }
  // Create user session
  addSession(userToken: IUserToken): void {
    localStorage.setItem(constants.userTokenName, JSON.stringify(userToken));
  }

  // Get current user details
  getSessionToken(): IUserToken | null {
    const userToken = localStorage.getItem(constants.userTokenName);
    if (userToken) {
      return JSON.parse(userToken);
    }

    return null;
  }

  // Clear current user details
  clearSession(): void {
    localStorage.removeItem(constants.userTokenName);
  }

  // Check current user role
  get userRole(): string | null {
    const token = this.getSessionToken();
    if (token) {
      return token.userDetails.role;
    }

    return token;
  }

  // Check if the user has role admin
  get isUserRoleAdmin(): boolean {
    const token = this.getSessionToken();
    if (token && token.userDetails.role === 'admin') {

      return true;
    }

    return false;
  }

  // Check if a user is logged in
  get hasUser(): boolean {
    return localStorage.getItem(constants.userTokenName) ? true : false;
  }
}
