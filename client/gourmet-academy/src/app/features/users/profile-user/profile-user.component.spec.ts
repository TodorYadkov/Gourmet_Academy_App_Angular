import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUserComponent } from './profile-user.component';

describe('ProfileUserComponent', () => {
  let component: ProfileUserComponent;
  let fixture: ComponentFixture<ProfileUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileUserComponent]
    });
    fixture = TestBed.createComponent(ProfileUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
