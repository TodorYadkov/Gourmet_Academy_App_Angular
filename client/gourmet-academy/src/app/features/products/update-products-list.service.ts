import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateProductsListService {
  // Generate new event to trigger method get All products
  triggerGetAllProducts = new EventEmitter<void>();
  // Emit new event
  emitTriggerGetAllProducts(): void {
    this.triggerGetAllProducts.emit();
  }
}