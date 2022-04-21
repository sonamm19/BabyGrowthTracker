import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GrowthChart } from './growthChart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OrdinalPipe } from './ordinal.pipe';
import { ReactiveForm } from './reactiveForm.component';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { LinearGaugeAnimationComponent } from './linear-gauge-animation.component';
import { IgxLinearGaugeModule } from 'igniteui-angular-gauges';
import { IgxButtonModule } from "igniteui-angular";

@NgModule({
    declarations: [AppComponent, GrowthChart, OrdinalPipe, ReactiveForm, BubbleChartComponent],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ChartsModule,
        IgxLinearGaugeModule,
        IgxButtonModule
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
