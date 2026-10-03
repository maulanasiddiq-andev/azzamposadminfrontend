import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JenisAkunDetail } from './jenis-akun-detail';

describe('JenisAkunDetail', () => {
  let component: JenisAkunDetail;
  let fixture: ComponentFixture<JenisAkunDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisAkunDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(JenisAkunDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
