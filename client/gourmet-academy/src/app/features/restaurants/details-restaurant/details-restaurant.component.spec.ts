import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRestaurantComponent } from './details-restaurant.component';

describe('DetailsRestaurantComponent', () => {
  let component: DetailsRestaurantComponent;
  let fixture: ComponentFixture<DetailsRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsRestaurantComponent]
    });
    fixture = TestBed.createComponent(DetailsRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
