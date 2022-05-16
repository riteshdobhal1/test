import { TestBed } from '@angular/core/testing';

import { CreatePasswordService } from './create-password.service';

xdescribe('CreatePasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatePasswordService = TestBed.get(CreatePasswordService);
    expect(service).toBeTruthy();
  });
});
