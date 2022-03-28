import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";



@Component({
    selector: 'reactive-form',
    templateUrl: './reactiveForm.component.html'
})


export class ReactiveForm {
    isFormSubmitted: boolean = false;
    form = new FormGroup({

        firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
        lastName: new FormControl('', [Validators.required]),
    })

    Submit() {
        if (this.form.invalid)
            return;
        this.isFormSubmitted = true;

        console.log(this.form);
        //   alert("Hello..." + this.form.controls['firstName'].value);
    }
}

