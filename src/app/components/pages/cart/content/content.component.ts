import { Component, OnInit } from '@angular/core';
import cartitem from '../../../../data/cartlist.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  // Cart
  taxvalue = 9.99;
  public cart: { id: number, qty: number, price: number }[] = cartitem;
  // Increment decrement
  public item = [];
  increment(item) {
    item.qty += 1;
  }
  decrement(item) {
    item.qty -= 1;
  }
  public calculateprice() {
    return this.cart.reduce((subtotal, item) => subtotal + item.qty * item.price, 0)
  };

  ngOnInit(): void {
  }

}
