import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { ValidateProductService } from '../validate-product.service';
import { IProduct } from 'src/app/models/product.interfaces';
import { UpdateProductsListService } from '../update-products-list.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnDestroy {
  // Get restaurant ID from parent
  @Input() restaurantId!: string;

  successMessage!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  subscription!: Subscription;
  imageUrl!: string;

  constructor(
    private validateProduct: ValidateProductService,
    private dataService: DataService,
    private updateProductList: UpdateProductsListService,
  ) { }

  // Create new product
  addProduct(formData: NgForm): void {
    const productData: IProduct = formData.value;
    // Validate user input
    const validatedProduct = this.validateProduct.validate(productData);
    if (validatedProduct.hasError) {
      this.errorMsgFromServer = validatedProduct.error;
      return;
    }
    
    this.isLoading = true;
    this.subscription = this.dataService.createNewProduct(this.restaurantId, validatedProduct.verifiedInput)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          formData.reset();
          this.imageUrl = ''; // Show default picture
          this.successMessage = `Успешно добавихте ${validatedProduct.verifiedInput.name}`;
          // Emit new event to update product list
          this.updateProductList.emitTriggerGetAllProducts();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      });
  }

  // Check if the current html path is correct
  validateImagePath(imagePath: string): void {
    this.imageUrl = this.validateProduct.validateImagePath(imagePath);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}