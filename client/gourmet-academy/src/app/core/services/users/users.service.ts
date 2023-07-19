import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserToken } from 'src/app/models/user.interfaces';
import { constants, endpoints } from '../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  register(userInput: { name: string, email: string, phone: string, address: string, password: string }): Observable<IUserToken> {
    const url = constants.hostBackEnd + endpoints.register;
    return this.http.post<IUserToken>(url, userInput);
  }

  login(userInput: { email: string, password: string }): Observable<IUserToken> {
    const url = constants.hostBackEnd + endpoints.login;
    return this.http.post<IUserToken>(url, userInput);
  }

  logout(): Observable<unknown> {
    const url = constants.hostBackEnd + endpoints.logout;
    return this.http.get(url);
  }

  getUserById(userId: string): Observable<IUser> {
    const url = constants.hostBackEnd + endpoints.getUserById(userId);
    return this.http.get<IUser>(url);
  }
}