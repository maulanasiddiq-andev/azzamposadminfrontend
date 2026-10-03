import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MappingAkunDetail } from './mapping-akun-detail';

describe('MappingAkunDetail', () => {
  let component: MappingAkunDetail;
  let fixture: ComponentFixture<MappingAkunDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappingAkunDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(MappingAkunDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
