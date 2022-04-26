import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GrowthChart } from './growthChart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IgxButtonModule } from 'igniteui-angular';
import { ChartsModule } from 'ng2-charts';
import { IgxLinearGaugeModule } from 'igniteui-angular-gauges';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GrowthChartComponent', () => {
    let fixture: ComponentFixture<GrowthChart>;
    let component: GrowthChart;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule,
                FormsModule,
                ChartsModule,
                IgxLinearGaugeModule,
                IgxButtonModule],
            providers: [DatePipe],
            declarations: [GrowthChart],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        fixture = TestBed.createComponent(GrowthChart);
        component = fixture.componentInstance;

        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render title in h4 tag', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h4')?.textContent).toContain('Baby Weight Percentile Tracker');
    });

    describe('#childName', () => {
        let childName: any;
        beforeEach(() => {
            childName = component?.login?.controls['childName'];
        });

        it('should be invalid if empty', () => {
            expect(childName.invalid).toBeTruthy();
        });

        it('should have "required" validation', () => {
            expect(childName.errors['required']).toBeTruthy();
        });
    });

    describe('#Weight', () => {
        let weight: any;
        beforeEach(() => {
            weight = component?.login?.controls['weight'];
        });

        it('should be invalid if empty', () => {
            expect(weight.invalid).toBeTruthy();
        });

        it('should have "required" validation', () => {
            expect(weight.errors['required']).toBeTruthy();
        });

        it('should accept only numbers(pattern validation)', () => {
            weight.setValue('abc');
            expect(weight.errors['pattern']).toBeTruthy();
        });

        it('should have 2 decimal points  e.g. 2.52', () => {
            weight.setValue('2.123');
            expect(weight.errors['pattern']).toBeTruthy();
        });
    });

    describe('#BirthDate', () => {
        let birthdate: any;
        beforeEach(() => {
            birthdate = component?.login?.controls['birthDate'];
        });

        it('should be invalid if empty', () => {
            expect(birthdate.invalid).toBeTruthy();
        });

        it('should have "required" validation', () => {
            expect(birthdate.errors['required']).toBeTruthy();
        });
    });

    describe('#MeasurementDate', () => {
        let measurementDate: any;
        beforeEach(() => {
            measurementDate = component?.login?.controls['measurementDate'];
        });

        it('should be todays date by default', () => {
            expect(measurementDate.value).toBe(component.datePipe.transform(new Date(), 'yyyy-MM-dd'));
        });

        it('should have min date same as birth date', () => {
            let birthDate = component?.login?.controls['birthDate'];

            let lastweek = new Date();
            lastweek.setDate(lastweek.getDate() - 7);
            birthDate?.setValue(component.datePipe.transform(lastweek, 'yyyy-MM-dd'));
            fixture.detectChanges();

            let minimumDate = fixture.debugElement.query(By.css('#measurementDate')).nativeElement.min;
            expect(birthDate?.value).toBe(minimumDate);
        });

        it('should have max date is Todays date', () => {
            let maxDate = fixture.debugElement.query(By.css('#measurementDate')).nativeElement.max;
            expect(measurementDate.value).toBe(maxDate);
        });
    });

    it('should called button click event', () => {
        spyOn(component, 'Submit');

        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        expect(component.Submit).toHaveBeenCalled();
    });
});