import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IComment } from 'src/app/models/comment.interfaces';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css']
})
export class EditCommentComponent implements OnDestroy {

  @Input() commentDetails!: IComment;
  @Output() updateCommentList = new EventEmitter;

  successMessage!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  subscription!: Subscription;
  imageUrl!: string;

  constructor(private dataService: DataService) { }

  // Edit comment
  updateComment(formData: NgForm): void {
    // Check user input
    const comment = formData.value;
    comment.comment = comment.comment.trim();
    if (comment.comment.length < 5 || comment.comment.length > 300) {
      this.errorMsgFromServer = 'Коментара трябва да бъде между 5 и 300 символа';
      return;
    }

    this.isLoading = true;
    this.subscription = this.dataService
      .updateComment(this.commentDetails._id, comment)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.commentDetails = data;
          this.successMessage = 'Успешна редакция';
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      });
  }

  // Update comment list on add-comments component
  onCloseModal(): void {
    this.updateCommentList.emit();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}