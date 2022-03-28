import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {
    transform(val: number): string {
        if (isNaN(val) || val < 1) {
            return "";
        } else {
            var lastDigit = val % 10;
            if (lastDigit === 1) {
                return val + 'st'
            } else if (lastDigit === 2) {
                return val + 'nd'
            } else if (lastDigit === 3) {
                return val + 'rd'
            } else if (lastDigit > 3) {
                return val + 'th'
            }
        }
        return "";
    }
}