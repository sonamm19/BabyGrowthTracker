import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleAreaChartComponent } from './bubble-area-chart.component';

describe('BubbleAreaChartComponent', () => {
  let component: BubbleAreaChartComponent;
  let fixture: ComponentFixture<BubbleAreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BubbleAreaChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
