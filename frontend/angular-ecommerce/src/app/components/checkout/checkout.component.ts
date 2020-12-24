import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { EcommerceShopFormService } from 'src/app/services/ecommerce-shop-form.service';

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
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAdress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAdress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        expirationMonth: [''],
        expirationYear: [''],
        securityCode: ['']
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
