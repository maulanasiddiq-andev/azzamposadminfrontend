import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoItemToggle } from './info-item-toggle';

describe('InfoItemToggle', () => {
  let component: InfoItemToggle;
  let fixture: ComponentFixture<InfoItemToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoItemToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoItemToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
