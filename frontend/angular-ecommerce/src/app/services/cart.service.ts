import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // Subject is used to publish events, so UI components, that read values totalProce and totalQuantity are updated, as these values update
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){

      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      
      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    // if the item already exists in cart, then increase quantity
    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    } else{
      // just add item to cart
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and quantity
    this.computeCartTotals()
    
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let tempCartItem of this.cartItems){
      totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantityValue += tempCartItem.quantity;
    }

    // publish new values, so all subscribers will update them
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }

}
