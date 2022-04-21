import { Component, Injectable } from "@angular/core";
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
type AOA = any[][];

@Injectable({
    // declares that this service should be created
    // by the root application injector.
    providedIn: 'root',
})


export class WeightPercentileCacheService {

    nameofExcel: string = "";

    constructor(private httpClient: HttpClient) {

    }
    data: AOA = [[], []];
    filePath: string = '';

    public readExcelSheet(gender: string, month: number): AOA {
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

                    /* save data */
                    this.data = <AOA>(XLSX.utils.sheet_to_json(ws1, { header: 1 }));
                };
                reader.readAsBinaryString(data);
            });

        return this.data;
    }


}

export const filePathWeightPercentileBoys: string = "assets/BoysPercentile.xlsx";
export const filePathWeightPercentileGirls: string = "assets/GirlsPercentile.xlsx";

interface jsonObj {
    Dummy1: string;
    Dummy2: string;
    Dummy3: string;
}