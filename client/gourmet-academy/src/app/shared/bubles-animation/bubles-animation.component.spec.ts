import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BublesAnimationComponent } from './bubles-animation.component';

describe('BublesAnimationComponent', () => {
  let component: BublesAnimationComponent;
  let fixture: ComponentFixture<BublesAnimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BublesAnimationComponent]
    });
    fixture = TestBed.createComponent(BublesAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
