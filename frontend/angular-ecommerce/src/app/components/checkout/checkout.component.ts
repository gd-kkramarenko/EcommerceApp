import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { EcommerceShopFormService } from 'src/app/services/ecommerce-shop-form.service';
import { EcommerceShopValidators } from 'src/app/validators/ecommerce-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private ecommerceShopFormService: EcommerceShopFormService){ }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        // all fields in the form are represented by FormControl, we specify initial value: '' and validators for the given field. 
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, 
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAdress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        street: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace])
      }),
      billingAdress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        street: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        expirationMonth: [''],
        expirationYear: [''],
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')])
      }),
    });

    // populate credit card months, +1 because in Js months are 0-based
    const startMonth: number = new Date().getMonth() + 1;

    this.ecommerceShopFormService.getCreditCardMonths(startMonth).subscribe(data => { this.creditCardMonths = data });

    // populate credit card years
    this.ecommerceShopFormService.getCreditCardYears().subscribe(data => { this.creditCardYears = data });

    //populate the countries
    this.ecommerceShopFormService.getCountries().subscribe(data => { this.countries = data });

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAdressStreet() { return this.checkoutFormGroup.get('shippingAdress.street'); }
  get shippingAdressCity() { return this.checkoutFormGroup.get('shippingAdress.city'); }
  get shippingAdressCountry() { return this.checkoutFormGroup.get('shippingAdress.country'); }
  get shippingAdressState() { return this.checkoutFormGroup.get('shippingAdress.state'); }
  get shippingAdressZipCode() { return this.checkoutFormGroup.get('shippingAdress.zipCode'); }

  get billingAdressStreet() { return this.checkoutFormGroup.get('billingAdress.street'); }
  get billingAdressCity() { return this.checkoutFormGroup.get('billingAdress.city'); }
  get billingAdressCountry() { return this.checkoutFormGroup.get('billingAdress.country'); }
  get billingAdressState() { return this.checkoutFormGroup.get('billingAdress.state'); }
  get billingAdressZipCode() { return this.checkoutFormGroup.get('billingAdress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAdressToBillingAdress(event){

    // if checkbox is checked, copy data from shipping to billing
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAdress.setValue(this.checkoutFormGroup.controls.shippingAdress.value);

      // bug fix, so state for billing adress is assigned, if user checked "Billing same as shipping"
      this.billingAdressStates = this.shippingAdressStates;
    } else {
      this.checkoutFormGroup.controls.billingAdress.reset();
      this.billingAdressStates = [];
    }
    
  }

  onSubmit(){
    // on submit click, check if some fields are invalid, if so, mark all as touched, it will invoke our error messages 
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear)

    // if the current year equals the selected years, then start months from current month,
    // else, show all months

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;     // +1 because in Js months are 0-based
    } else{
      startMonth = 1;
    }

    this.ecommerceShopFormService.getCreditCardMonths(startMonth).subscribe(data => { this.creditCardMonths = data });

  }

  getStates(formGroupName: string){

    // getting form group: shipping / billing
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    this.ecommerceShopFormService.getStates(countryCode).subscribe(data => {

      if(formGroupName === 'shippingAdress'){
        this.shippingAdressStates = data;
      } else{
        this.billingAdressStates = data;
      }

      // select first state as default
      formGroup.get('state').setValue(data[0]);
    })



  }

}
