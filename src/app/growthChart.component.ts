import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
@Component({

    selector: 'growth-chart',
    templateUrl: './growthChart.component.html'
})


export class GrowthChart implements OnInit {

    @ViewChild('login', { static: true }) login: NgForm | undefined;

    // Child Details
    childName: string = "";
    gender: string = "";
    dateOfBirth: any;
    dateOfMeasurement: any;
    weight: string = "";
    selectedWeightUnit: any;
    weightUnitMatric: any;

    public selectedValue: any;
    filePath: string = "";
    submitted: boolean = false;
    childWeightinKg: any = 0;
    percentile: string = "";
    percentileResult: string = "";
    monthBasedPercentile: any;
    ageInMonth: any;
    growthChart: GrowthChart = {} as GrowthChart;
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

        console.log(login);
        if (login.valid) {

            if (this.dateOfBirth === undefined)
                return;

            this.ageInMonth = this.calculateMonthfromDOB(this.dateOfBirth);
            if (this.ageInMonth > 60) {
                alert("Baby's age should not be more than 5 years");
                return;
            }
            this.ConvertWeightInKg();
            this.readExcelSheet(this.gender, this.ageInMonth);

            console.log(login);
            console.log(this.childName + " " + this.dateOfBirth + " " + this.dateOfMeasurement + " " + this.gender
                + " " + this.weight + "(" + this.selectedWeightUnit.DisplayValue + ")");

            console.log(this.monthBasedPercentile);
            this.submitted = true;
        }
    }


    GetClosetpercentileValue(weight: any, arr: number[]) {

        if (arr === undefined || arr.length == 0) {
            return 0;
        }
        const output = arr.reduce((prev: number, curr: number) => Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev);

        return output;
    }

    ConvertWeightInKg() {
        this.childWeightinKg = this.weight;
        if (this.selectedWeightUnit.DisplayValue === "lb") {
            this.childWeightinKg = (this.childWeightinKg * 0.45359237).toFixed(2);
        }
    }

    /*
    |P01  P1	P3	 P5	  P10|
    |2	  2.3	2.5	 2.6  2.8|
    */
    findPercentile(percentileValues: any) {

        if (percentileValues === undefined)
            return false;

        let percentileArrayValues = [];
        for (var key in percentileValues) {
            if (key.startsWith("P")) {  // ignore Month
                percentileArrayValues.push(percentileValues[key]);
            }
        }
        var valueItem = this.GetClosetpercentileValue(this.childWeightinKg, percentileArrayValues);


        // Find percentile based on it's value
        var keyItem = Object.keys(percentileValues).find(key => percentileValues[key] === valueItem);
        if (keyItem == undefined) {
            return false;
        }
        this.percentile = keyItem?.toString().replace('P', '');
        return true;
    }

    calculateMonthfromDOB(birthdate: Date) {
        var month = new Date().getMonth() - new Date(birthdate).getMonth() + (12 * (new Date().getFullYear() - new Date(birthdate).getFullYear()));
        return Math.abs(month);
    }

    onWeightUnitChange() {
        this.ConvertWeightInKg();
    }
    readExcelSheet(gender: string, month: number) {
        if (gender === 'Male') {
            this.filePath = filePathWeightPercentileBoys;
        }
        else {
            this.filePath = filePathWeightPercentileGirls;
        }
        this.httpClient.get(this.filePath, { responseType: 'blob' })
            .subscribe((data: any) => {
                const reader: FileReader = new FileReader();
                let dataJson1;

                reader.onload = (e: any) => {
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                    /* grab first sheet */
                    const wsname1: string = wb.SheetNames[0];
                    const ws1: XLSX.WorkSheet = wb.Sheets[wsname1];

                    /* save data to 'monthBasedPercentile'*/
                    dataJson1 = XLSX.utils.sheet_to_json(ws1);
                    this.monthBasedPercentile = dataJson1[month];
                };
                reader.readAsBinaryString(data);
            });
    }
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