import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IComment } from 'src/app/models/comment.interfaces';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.css']
})
export class DeleteCommentComponent implements OnDestroy {

  @Input() commentDetails!: IComment;
  @Output() updateCommentList = new EventEmitter;

  successMessage!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  subscription!: Subscription;
  disableBtnDelete: boolean = false;

  constructor(private dataService: DataService) { }

  // Delete comment
  deleteComment(commentId: string): void {
    this.isLoading = true;
    this.subscription = this.dataService
      .deleteComment(commentId)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.disableBtnDelete = true;
          this.successMessage = `Успешно изтрихте: ${data.deletedComment.comment}`;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      })
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