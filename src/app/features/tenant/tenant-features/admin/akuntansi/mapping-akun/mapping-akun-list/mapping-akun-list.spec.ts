import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MappingAkunList } from './mapping-akun-list';

describe('MappingAkunList', () => {
  let component: MappingAkunList;
  let fixture: ComponentFixture<MappingAkunList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappingAkunList],
    }).compileComponents();

    fixture = TestBed.createComponent(MappingAkunList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
