import { DecimalPipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { WeightPercentileCacheService } from "./app.weightPercentileCache.service";
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';


@Component({

    selector: 'growth-chart',
    templateUrl: './growthChart.component.html',
    providers: [WeightPercentileCacheService]
})


export class GrowthChart implements OnInit {

    public selectedValue: any;
    filePath: string = "";
    submitted: boolean = false;
    childDetail = new ChildDetail();
    childWeightinKg: any;
    percentile: string = "";
    percentileResult: string = "";
    monthBasedPercentile: any;

    growthChart: GrowthChart = {} as GrowthChart;
    maxDate: Date = new Date();

    constructor(private httpClient: HttpClient) {
        console.log("inside constructor");
    }

    ngOnInit(): void {
        this.childDetail.gender = "Male";
        this.childDetail.weightUnitMatric = WeighUnitItems;
        this.childDetail.selectedWeightUnit = this.childDetail.weightUnitMatric[0];

    }


    Submit(login: any) {

        if (login.valid) {

            if (this.childDetail.dateOfBirth === undefined)
                return;

            var ageInMonth = this.calculateMonthfromDOB(this.childDetail.dateOfBirth);
            if (ageInMonth > 60) {
                alert("Baby's age should not be more than 5 years");
                return;
            }

            this.readExcelSheet(this.childDetail.gender, ageInMonth);

            console.log(login);
            console.log(this.childDetail.childName + " " + this.childDetail.dateOfBirth + " " + this.childDetail.dateOfMeasurement + " " + this.childDetail.gender
                + " " + this.childDetail.weight + "(" + this.childDetail.selectedWeightUnit.DisplayValue + ")");

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

    /*
    |P01  P1	P3	 P5	  P10|
    |2	  2.3	2.5	 2.6  2.8|
    */
    findPercentile(percentileValues: any) {

        if (percentileValues === undefined)
            return false;

        // Covert lb to kg.
        this.childWeightinKg = this.childDetail.weight;
        if (this.childDetail.selectedWeightUnit.DisplayValue === "lb") {
            this.childWeightinKg = (this.childWeightinKg * 0.45359237).toFixed(2);
        }

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

export class ChildDetail {
    childName: string = "";
    gender: string = "";
    dateOfBirth: Date | undefined;
    dateOfMeasurement: Date | undefined;
    weight: DecimalPipe | undefined;
    selectedWeightUnit: any;
    weightUnitMatric: any;


}


export const WeighUnitItems = [
    { Id: 1, DisplayValue: 'lb' },
    { Id: 2, DisplayValue: 'kg' }

];

export const VolumeUnitItems = [
    { Id: 1, DisplayValue: 'cm' },
    { Id: 2, DisplayValue: 'inch' }
]
export const filePathWeightPercentileBoys: string = "assets/BoysPercentile.xlsx";
export const filePathWeightPercentileGirls: string = "assets/GirlsPercentile.xlsx";