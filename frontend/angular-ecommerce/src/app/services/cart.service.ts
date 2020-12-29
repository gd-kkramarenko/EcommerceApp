import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // Subject is used to publish events, so UI components, that read values totalProce and totalQuantity are updated, as these values update
  // Behavior subject is a subclass, it will publish the last computed values to the new subscribers, even if they are INSTANTIATED LATER
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

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

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    } else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    
    // get the index of item in array
    const itemToRemoveIndex = this.cartItems.findIndex(item => item.id === theCartItem.id)

    // if found, remove at given index
    if(itemToRemoveIndex > -1){
      this.cartItems.splice(itemToRemoveIndex, 1);

      this.computeCartTotals();
    }
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
