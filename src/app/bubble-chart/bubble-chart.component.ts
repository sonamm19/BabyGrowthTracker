import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
    selector: 'pm-bubble-chart',
    templateUrl: './bubble-chart.component.html',
    styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent {
    public bubbleChartOptions: ChartOptions = {
        responsive: true,
        scales: {
            xAxes: [{
                ticks: {
                    min: 0,
                    max: 30,
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 30,
                }
            }]
        }
    };
    public bubbleChartType: ChartType = 'bubble';
    public bubbleChartLegend = true;

    public bubbleChartData: ChartDataSets[] = [
        {
            data: [
                { x: 1, y: 2, r: 1 },
                { x: 2, y: 4, r: 2 },
                { x: 3, y: 6, r: 3 },
                { x: 4, y: 8, r: 4 },
                { x: 5, y: 10, r: 5 },
                { x: 6, y: 12, r: 6 },
                { x: 7, y: 14, r: 7 },
                { x: 8, y: 16, r: 8 },
                { x: 9, y: 18, r: 9 },
                { x: 10, y: 20, r: 10 },
                { x: 11, y: 22, r: 11 },
                { x: 12, y: 24, r: 12 }
            ],
            label: 'Series A',
        },
        // {
        //     data: [
        //         { x: 8, y: 7, r: 5 },
        //         { x: 15, y: 5, r: 15 },
        //         { x: 5, y: 15, r: 15 },
        //         { x: 7, y: 8, r: 8 },
        //     ],
        //     label: 'Series B',
        // },
    ];
    constructor() { }
    ngOnInit() {
    }
}