import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { translateErrorsFromServer } from 'src/app/core/environments/constants';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ValidateUserService } from '../validate-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMsgFromServer!: string;
  subscription!: Subscription;
  isLoading: boolean = false;
  constructor(
    private title: Title,
    private router: Router,
    private userService: UsersService,
    private validateUser: ValidateUserService,
    private managerSession: ManagerSessionService,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Вход');

  }

  // Login
  loginUser(formData: NgForm): void {
    // Validate user input
    const userCheck = this.validateUser.loginValidate(formData);
    if (userCheck.hasError) {
      this.errorMsgFromServer = userCheck.error;
      return;
    }

    this.isLoading = true;
    this.subscription = this.userService.login(userCheck.verifiedInput)
      .subscribe({
        next: (data) => {
          const userToken = data;
          this.managerSession.addSession(userToken);
          this.isLoading = false;
          formData.reset();
          this.router.navigate(['/']);
        },
        error: (error) => {
          const errors = translateErrorsFromServer; // Translate error
          this.errorMsgFromServer = errors.has(error.error.message.join('\n'))
            ? errors.get(error.error.message.join('\n'))
            : error.error.message.join('\n');
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