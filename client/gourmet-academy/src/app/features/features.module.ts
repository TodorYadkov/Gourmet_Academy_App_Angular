import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';
import { AddRestaurantComponent } from './restaurants/add-restaurant/add-restaurant.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProfileComponent } from './users/profile-admin/profile.component';
import { ProfileUserComponent } from './users/profile-user/profile-user.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditRestaurantComponent } from './restaurants/edit-restaurant/edit-restaurant.component';
import { DetailsRestaurantComponent } from './restaurants/details-restaurant/details-restaurant.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedModule } from "../shared/shared.module";
import { ListProductsComponent } from './products/list-products/list-products.component';
import { DeleteProductComponent } from './products/delete-product/delete-product.component';
import { DeleteRestaurantComponent } from './restaurants/delete-restaurant/delete-restaurant.component';
import { OrderComponent } from './orders/order/order.component';
import { CommentsComponent } from './comments/add-comments/add-comments.component';
import { EditCommentComponent } from './comments/edit-comment/edit-comment.component';
import { DeleteCommentComponent } from './comments/delete-comment/delete-comment.component';
import { PaymentComponent } from './orders/payment/payment.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { DeleteOrderComponent } from './orders/delete-order/delete-order.component';


@NgModule({
    declarations: [
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        AddRestaurantComponent,
        AddProductComponent,
        AboutUsComponent,
        ProfileComponent,
        EditRestaurantComponent,
        DetailsRestaurantComponent,
        EditProductComponent,
        NotFoundComponent,
        ListProductsComponent,
        DeleteProductComponent,
        DeleteRestaurantComponent,
        OrderComponent,
        CommentsComponent,
        EditCommentComponent,
        DeleteCommentComponent,
        PaymentComponent,
        ProfileUserComponent,
        EditOrderComponent,
        DeleteOrderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class FeaturesModule { }
