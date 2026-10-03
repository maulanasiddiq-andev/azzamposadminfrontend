import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingLayout } from './loading-layout';

describe('LoadingLayout', () => {
  let component: LoadingLayout;
  let fixture: ComponentFixture<LoadingLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
