import { TestBed } from '@angular/core/testing';
import { JenisAkunService } from './jenis-akun-service';

describe('JenisAkunService', () => {
  let service: JenisAkunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JenisAkunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
