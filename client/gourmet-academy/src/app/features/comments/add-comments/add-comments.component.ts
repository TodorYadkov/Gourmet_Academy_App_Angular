import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { IComment } from 'src/app/models/comment.interfaces';
import { IRestaurant } from 'src/app/models/restaurant.interfaces';

@Component({
  selector: 'app-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() restaurantDetails!: IRestaurant;
  @Input() isRoleAdmin!: boolean; // Check if the current user has an admin role if it has the hide comment form

  allComments!: IComment[];
  subscription!: Subscription;
  errorMsgFromServer!: string;
  isLoading!: boolean;
  userId!: string | undefined;

  constructor(
    private dataService: DataService,
    private managerSession: ManagerSessionService,
  ) { }

  ngOnInit(): void {
    // Get user ID
    this.userId = this.managerSession.getSessionToken()?.userDetails._id;

    this.getAllComments();
  }

  // Update list of comments after edit or delete
  updateComment(): void {
    this.getAllComments();
  }

  // Post new comment - userId is added from JWT token on server side
  postComment(formData: NgForm): void {
    // Check if the current user is the owner of current restaurant
    if (this.restaurantDetails.owner._id === this.userId) {
      this.errorMsgFromServer = 'Коментар не е позволен - Вие сте собственик';
      return;
    }
    // Check user input
    const comment = formData.value;
    comment.comment = comment.comment.trim();
    if (comment.comment.length < 5 || comment.comment.length > 300) {
      this.errorMsgFromServer = 'Коментара трябва да бъде между 5 и 300 символа';
      return;
    }

    this.isLoading = true;
    this.subscription = this.dataService
      .addNewComment(this.restaurantDetails._id, comment)
      .subscribe({
        next: (data) => this.isLoading = false,
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        },
        complete: () => {
          this.getAllComments()
          this.isLoading = false;
        },
      });
  }

  // Get all comments from DB
  private getAllComments(): void {
    this.isLoading = true;
    this.subscription = this.dataService
      .getAllCommentsRestaurant(this.restaurantDetails._id)
      .subscribe({
        next: (data) => {
          this.allComments = data.reverse();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}