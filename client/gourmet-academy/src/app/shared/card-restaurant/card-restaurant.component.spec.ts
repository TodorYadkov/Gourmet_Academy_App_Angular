import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRestaurantComponent } from './card-restaurant.component';

describe('CardRestaurantComponent', () => {
  let component: CardRestaurantComponent;
  let fixture: ComponentFixture<CardRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardRestaurantComponent]
    });
    fixture = TestBed.createComponent(CardRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
