import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JenisAkunList } from './jenis-akun-list';

describe('JenisAkunList', () => {
  let component: JenisAkunList;
  let fixture: ComponentFixture<JenisAkunList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisAkunList],
    }).compileComponents();

    fixture = TestBed.createComponent(JenisAkunList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
