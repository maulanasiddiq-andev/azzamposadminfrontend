import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AkunList } from './akun-list';

describe('AkunList', () => {
  let component: AkunList;
  let fixture: ComponentFixture<AkunList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AkunList],
    }).compileComponents();

    fixture = TestBed.createComponent(AkunList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
