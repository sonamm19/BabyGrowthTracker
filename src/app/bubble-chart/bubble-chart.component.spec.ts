import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartsModule } from 'ng2-charts';

import { BubbleChartComponent } from './bubble-chart.component';

describe('BubbleChartComponent', () => {
    let component: BubbleChartComponent;
    let fixture: ComponentFixture<BubbleChartComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BubbleChartComponent],
            imports: [ChartsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BubbleChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });
});
