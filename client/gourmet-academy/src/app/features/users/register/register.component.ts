import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { translateErrorsFromServer } from 'src/app/core/environments/constants';
import { Title } from '@angular/platform-browser';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { IUser, IUserToken } from 'src/app/models/user.interfaces';
import { ValidateUserService } from '../validate-user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  userToken!: IUserToken;
  subscription!: Subscription;
  errorMsgFromServer!: string;
  isLoading: boolean = false;

  constructor(
    private title: Title,
    private router: Router,
    private userService: UsersService,
    private validateUser: ValidateUserService,
    private managerSession: ManagerSessionService,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Регистрация');

  }

  // Register
  registerUser(formData: NgForm): void {
    const userInput: IUser = formData.value;
    console.log(userInput)
    // Validate user input
    const userCheck = this.validateUser.registerValidate(userInput, formData.value.repass);
    if (userCheck.hasError) {
      this.errorMsgFromServer = userCheck.error;
      return;
    }

    this.isLoading = true;
    this.subscription = this.userService.register(userCheck.verifiedInput)
      .subscribe({
        next: (data) => {
          this.userToken = data;
          formData.reset();
          this.managerSession.addSession(this.userToken);
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          const errors = translateErrorsFromServer; // Translate the error
          this.errorMsgFromServer = errors.has(error.error.message.join('\n'))
            ? errors.get(error.error.message.join('\n'))
            : error.error.message.join('\n'); // Translate the error and if it is different from the current one, show it in English
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}