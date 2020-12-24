import { FormControl, ValidationErrors } from "@angular/forms";

export class EcommerceShopValidators {

    //whitespace validation
    static notOnlyWhitespace(control: FormControl): ValidationErrors{

        // check if the string only contains whitespace
        if((control.value != null) && (control.value.trim().length === 0)){

            // invalid, return error
            return { 'notOnlyWhitespace': true};
        }

        return null;
    }
}
