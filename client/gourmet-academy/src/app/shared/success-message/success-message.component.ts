import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessMessageComponent {
  @Input() successMessage!: string | undefined;
  @Input() autoHide!: boolean | undefined;
  
}
