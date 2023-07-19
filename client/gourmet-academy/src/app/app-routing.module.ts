import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RegisterComponent } from './features/users/register/register.component';
import { LoginComponent } from './features/users/login/login.component';
import { AddRestaurantComponent } from './features/restaurants/add-restaurant/add-restaurant.component';
import { ProfileComponent } from './features/users/profile-admin/profile.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { DetailsRestaurantComponent } from './features/restaurants/details-restaurant/details-restaurant.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { onlyForGuestGuard } from './core/guards/only-for-guest.guard';
import { onlyForLoggedInGuard } from './core/guards/only-for-logged-in.guard';
import { OrderComponent } from './features/orders/order/order.component';
import { onlyForAdminGuard } from './core/guards/only-for-admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', canActivate: [onlyForGuestGuard], component: LoginComponent },
  { path: 'register', canActivate: [onlyForGuestGuard], component: RegisterComponent },
  { path: 'add-restaurants', canActivate: [onlyForLoggedInGuard, onlyForAdminGuard], component: AddRestaurantComponent },
  { path: 'profile', canActivate: [onlyForLoggedInGuard], component: ProfileComponent },
  { path: 'details/:restaurantId', canActivate: [onlyForLoggedInGuard, onlyForAdminGuard], component: DetailsRestaurantComponent },
  { path: 'orders/:restaurantId', component: OrderComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }