import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AkunDetail } from './akun-detail';

describe('AkunDetail', () => {
  let component: AkunDetail;
  let fixture: ComponentFixture<AkunDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AkunDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AkunDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
