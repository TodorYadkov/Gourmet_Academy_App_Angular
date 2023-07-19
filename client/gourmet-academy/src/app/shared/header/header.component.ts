import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  theme!: string;
  subscription!: Subscription;
  isUserAdmin!: boolean; // Use to show and hide add-restaurants (Only admin role is allowed to create new restaurant)

  constructor(
    @Inject(DOCUMENT) private document: Document, // Use document object to add new class in index.html on html tag
    private themeService: ThemeService,
    private userService: UsersService,
    private managerSession: ManagerSessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.theme = this.themeService.theme; // Set theme color 
    this.updateThemeColor(); // Set theme color 
  }

  // check which navigation to display
  updateNav(): boolean {

    this.isUserAdmin = this.managerSession.isUserRoleAdmin // Check is current user has role admin
    return this.managerSession.hasUser;
  }

  // Check which theme to apply
  checkThemeState(): void { // Check current state of the theme
    this.themeService.theme = this.themeService.theme === 'light' ? 'dark' : 'light';
    this.theme = this.themeService.theme;
    this.updateThemeColor()
  }
  // Update with selected theme
  private updateThemeColor() {
    this.document.documentElement.setAttribute('data-bs-theme', this.themeService.theme); // Set new attribute on html tag to show correct theme
  }

  // Logout
  logout(): void {
    this.subscription = this.userService.logout()
      .subscribe({
        next: (data) => {
          this.managerSession.clearSession();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.managerSession.clearSession();
          console.error(error.error.message)
          this.router.navigate(['/']);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}