import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOrderComponent } from './delete-order.component';

describe('DeleteOrderComponent', () => {
  let component: DeleteOrderComponent;
  let fixture: ComponentFixture<DeleteOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteOrderComponent]
    });
    fixture = TestBed.createComponent(DeleteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
