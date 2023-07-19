import { TestBed } from '@angular/core/testing';

import { ManagerSessionService } from './manager-session.service';

describe('AddSessionService', () => {
  let service: ManagerSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
