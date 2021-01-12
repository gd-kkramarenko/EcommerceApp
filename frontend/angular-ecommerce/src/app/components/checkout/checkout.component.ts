import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
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

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private ecommerceShopFormService: EcommerceShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router){ }

  ngOnInit(): void {

    // getting totals
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        // all fields in the form are represented by FormControl, we specify initial value: '' and validators for the given field. 
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, 
                                    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        street: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
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

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event){

    // if checkbox is checked, copy data from shipping to billing
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix, so state for billing address is assigned, if user checked "Billing same as shipping"
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
    
  }

  onSubmit() {
    // on submit click, check if some fields are invalid, if so, mark all as touched, it will invoke our error messages 
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempItem => new OrderItem(tempItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.shippingAddress.state = shippingState.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    purchase.billingAddress.country = billingCountry.name;
    purchase.billingAddress.state = billingState.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via CheckoutService

    this.checkoutService.placeOrder(purchase).subscribe({ 
        next: response => {
            alert(`Your order has been received.\nOreder tracking number: ${response.orderTrackingNumber}`);

            this.resetCart();
          },

        error: err => {
            alert(`There was an error: ${err.message}`)
          }
      }
    );

  }

  resetCart() {
    // resets cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form data
    this.checkoutFormGroup.reset();

    // navigate back to products page
    this.router.navigateByUrl("/products");

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

      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      } else{
        this.billingAddressStates = data;
      }

      // select first state as default
      formGroup.get('state').setValue(data[0]);
    })



  }

  reviewCartDetails() {

    this.cartService.totalPrice.subscribe(data => { this.totalPrice = data });

    this.cartService.totalQuantity.subscribe(data => { this.totalQuantity = data });
  }

}
