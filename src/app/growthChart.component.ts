import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { IgxLinearGaugeComponent } from "igniteui-angular-gauges";
import { IgxLinearGraphRangeComponent } from "igniteui-angular-gauges";
import { LinearGraphNeedleShape } from "igniteui-angular-gauges";
import { firstValueFrom, lastValueFrom } from 'rxjs';

type AOA = any[][];


@Component({

    selector: 'growth-chart',
    templateUrl: './growthChart.component.html',
})


export class GrowthChart implements OnInit {

    @ViewChild('login', { static: true }) login: NgForm | undefined;
    @ViewChild("linearGauge", { static: true })

    public linearGauge: IgxLinearGaugeComponent;

    // Child Details
    childName: string = "";
    gender: string = "";
    dateOfBirth: any;
    dateOfMeasurement: any;
    weight: string = "";
    selectedWeightUnit: any;
    weightUnitMatric: any;

    selectedValue: any;
    filePath: string = "";
    submitted: boolean = false;
    childWeightinKg: any = 0;
    percentile: number;
    percentileResult: string = "";
    monthBasedPercentile: any;
    ageInMonth: any;
    maxDate: Date = new Date();

    constructor(private httpClient: HttpClient, public datePipe: DatePipe) {
        console.log("inside constructor" + this.login);
    }

    ngOnInit(): void {
        this.gender = "Male";
        this.weightUnitMatric = WeighUnitItems;
        this.selectedWeightUnit = this.weightUnitMatric[0];
        this.dateOfMeasurement = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }



    Submit(login: any) {

        if (login.valid) {
            if (this.dateOfBirth === undefined)
                return;

            this.ageInMonth = this.calculateMonthfromDOB(this.dateOfBirth);
            if (this.ageInMonth > 60) {
                alert("Baby's age should not be more than 5 years");
                return;
            }

            this.ConvertWeightInKg();

            var promisePercentile = this.FindPercentile(this.gender, this.ageInMonth);

            promisePercentile.then((value) => {
                this.percentile = value;
                this.AnimateToGauge(Number(value));
            }).catch((err) => {
                alert(err.message);
                console.log(err);
                this.submitted = false;
                return;
            });


            console.log(login);
            console.log(this.childName + " " + this.dateOfBirth + " " + this.dateOfMeasurement + " " + this.gender
                + " " + this.weight + "(" + this.selectedWeightUnit.DisplayValue + ")");
            this.submitted = true;
        }
    }


    //#region Main Function

    async FindPercentile(gender: string, month: number): Promise<any> {

        if (gender === 'Male') {
            this.filePath = filePathWeightPercentileBoys;
        }
        else {
            this.filePath = filePathWeightPercentileGirls;
        }

        //Read Excel
        let dataJson;
        const data = await lastValueFrom(this.httpClient.get(filePathWeightPercentileBoys, { responseType: 'blob' }))
        const reader: FileReader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                dataJson = XLSX.utils.sheet_to_json(ws);
                this.monthBasedPercentile = dataJson[month];

                // Calculate percentile based on age
                this.percentile = this.CalculatePercentile(this.monthBasedPercentile)
                console.log("this.percentile " + this.percentile);
                if (this.percentile != undefined && this.percentile >= 0 && this.percentile <= 100) {
                    resolve(this.percentile);
                }
                else {
                    if (this.percentile < 0 || this.percentile > 100)
                        reject(new Error('Percentage is in invalid range. please input correct data'));
                    else
                        reject(new Error('Error in calculating percentage'));
                }

            };
            reader.readAsBinaryString(data);
        });
    }

    // Show percentile indicator
    public AnimateToGauge(val: number): void {
        // linear gauge requires settings for these properties:
        this.linearGauge.minimumValue = 0;
        this.linearGauge.maximumValue = 100;
        this.linearGauge.value = val;
        this.linearGauge.interval = 10;

        // setting custom appearance of labels
        this.linearGauge.labelInterval = 10;
        this.linearGauge.labelExtent = 0.05;

        // setting custom appearance of needle
        this.linearGauge.isNeedleDraggingEnabled = true;
        this.linearGauge.needleShape = LinearGraphNeedleShape.Needle;
        this.linearGauge.needleBrush = "#79797a";
        this.linearGauge.needleOutline = "#ffffffff";
        this.linearGauge.needleStrokeThickness = 1;
        this.linearGauge.needleOuterExtent = 0.9;
        this.linearGauge.needleInnerExtent = 0.3;

        // setting custom appearance of major/minor ticks
        this.linearGauge.minorTickCount = 5;
        this.linearGauge.minorTickEndExtent = 0.10;
        this.linearGauge.minorTickStartExtent = 0.20;
        this.linearGauge.minorTickStrokeThickness = 1;
        this.linearGauge.tickStartExtent = 0.25;
        this.linearGauge.tickEndExtent = 0.05;
        this.linearGauge.tickStrokeThickness = 2;

        // setting custom gauge ranges
        const range1 = new IgxLinearGraphRangeComponent();
        range1.startValue = 0;
        range1.endValue = 5;
        const range2 = new IgxLinearGraphRangeComponent();
        range2.startValue = 5;
        range2.endValue = 85;
        const range3 = new IgxLinearGraphRangeComponent();
        range3.startValue = 85;
        range3.endValue = 95;
        const range4 = new IgxLinearGraphRangeComponent();
        range4.startValue = 95;
        range4.endValue = 100;

        this.linearGauge.rangeBrushes = ["#FF6347", "#9ACD32", "#FFD700", "#FF6347"];
        this.linearGauge.rangeOutlines = ["#FF6347", "#9ACD32", "#FFD700", "#FF6347"];
        this.linearGauge.ranges.clear();
        this.linearGauge.ranges.add(range1);
        this.linearGauge.ranges.add(range2);
        this.linearGauge.ranges.add(range3);
        this.linearGauge.ranges.add(range4);

        // setting extent of all gauge ranges
        for (let i = 0; i < this.linearGauge.ranges.count; i++) {
            const range = this.linearGauge.ranges.item(i);
            range.innerStartExtent = 0.075;
            range.innerEndExtent = 0.075;
            range.outerStartExtent = 0.65;
            range.outerEndExtent = 0.65;
        }

        // setting extent of gauge scale
        this.linearGauge.scaleStrokeThickness = 0;
        this.linearGauge.scaleBrush = "#ffffff";
        this.linearGauge.scaleOutline = "#dbdbdb";
        this.linearGauge.scaleInnerExtent = 0.075;
        this.linearGauge.scaleOuterExtent = 0.85;
        this.linearGauge.scaleStartExtent = 0.05;
        this.linearGauge.scaleEndExtent = 0.95;

        // setting appearance of backing fill and outline
        this.linearGauge.backingBrush = "#ffffff";
        this.linearGauge.backingOutline = "#d1d1d1";
        this.linearGauge.backingStrokeThickness = 0;
        this.linearGauge.height = "100px";
        this.linearGauge.width = "400px";
    }
    //#endregion

    //#region Supporting Function

    onWeightUnitChange() {
        this.ConvertWeightInKg();
    }

    ConvertWeightInKg() {
        this.childWeightinKg = this.weight;
        if (this.selectedWeightUnit.DisplayValue === "lb") {
            this.childWeightinKg = (this.childWeightinKg * 0.45359237).toFixed(2);
        }
    }

    calculateMonthfromDOB(birthdate: Date) {
        var month = new Date().getMonth() - new Date(birthdate).getMonth() + (12 * (new Date().getFullYear() - new Date(birthdate).getFullYear()));
        return Math.abs(month);
    }

    /*
       |P01  P1	P3	 P5	  P10|
       |2	  2.3	2.5	 2.6  2.8|
       */
    CalculatePercentile(percentileValues: any) {

        if (percentileValues === undefined)
            return 0;

        let percentileArrayValues = [];
        for (var key in percentileValues) {
            if (key.startsWith("P")) {  // ignore Month
                percentileArrayValues.push(percentileValues[key]);
            }
        }
        var valueItem = this.GetClosetpercentileValue(this.childWeightinKg, percentileArrayValues);


        // Find actual percentile based on it's value
        var keyItem = Object.keys(percentileValues).find(key => percentileValues[key] === valueItem);
        if (keyItem == undefined) {
            return 0;
        }
        return Number(keyItem?.toString().replace('P', ''));
    }

    GetClosetpercentileValue(weight: any, arr: number[]) {

        if (arr === undefined || arr.length == 0) {
            return 0;
        }
        const output = arr.reduce((prev: number, curr: number) => Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev);

        return output;
    }
    //#endregion



}

export const WeighUnitItems = [
    { Id: 1, DisplayValue: 'kg' },
    { Id: 2, DisplayValue: 'lb' }

];

export const VolumeUnitItems = [
    { Id: 1, DisplayValue: 'cm' },
    { Id: 2, DisplayValue: 'inch' }
]
export const filePathWeightPercentileBoys: string = "assets/BoysPercentile.xlsx";
export const filePathWeightPercentileGirls: string = "assets/GirlsPercentile.xlsx";