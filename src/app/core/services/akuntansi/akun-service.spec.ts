import { TestBed } from '@angular/core/testing';
import { AkunService } from './akun-service';

describe('AkunService', () => {
  let service: AkunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AkunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
