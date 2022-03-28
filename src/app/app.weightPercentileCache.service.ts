import { Component, Injectable } from "@angular/core";
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import readXlsxFile from 'read-excel-file'


@Injectable({
    // declares that this service should be created
    // by the root application injector.
    providedIn: 'root',
})


export class WeightPercentileCacheService {

    nameofExcel: string = "";
    constructor(private httpClient: HttpClient) { }




}



interface jsonObj {
    Dummy1: string;
    Dummy2: string;
    Dummy3: string;
}