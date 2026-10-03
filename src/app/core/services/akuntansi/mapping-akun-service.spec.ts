import { TestBed } from '@angular/core/testing';
import { MappingAkunService } from './mapping-akun-service';

describe('MappingAkunService', () => {
  let service: MappingAkunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappingAkunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
