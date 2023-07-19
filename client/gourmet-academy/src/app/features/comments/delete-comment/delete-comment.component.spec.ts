import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCommentComponent } from './delete-comment.component';

describe('DeleteCommentComponent', () => {
  let component: DeleteCommentComponent;
  let fixture: ComponentFixture<DeleteCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteCommentComponent]
    });
    fixture = TestBed.createComponent(DeleteCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
