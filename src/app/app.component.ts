import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Component } from "@angular/core";



@Component({

    selector: 'pm-root',
    template: ` <div class="page-header">
    <h3>{{Title}}</h3>
    <growth-chart></growth-chart>`
})

export class AppComponent {
    Title: string = "Baby weight growth tracker";
}