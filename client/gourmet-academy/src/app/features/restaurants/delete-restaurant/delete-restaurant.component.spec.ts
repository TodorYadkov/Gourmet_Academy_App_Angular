import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRestaurantComponent } from './delete-restaurant.component';

describe('DeleteRestaurantComponent', () => {
  let component: DeleteRestaurantComponent;
  let fixture: ComponentFixture<DeleteRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRestaurantComponent]
    });
    fixture = TestBed.createComponent(DeleteRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
