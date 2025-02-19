import { Component, OnInit } from '@angular/core';
import cartitem from '../../../data/cartlist.json';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.css']
})
export class CartlistComponent implements OnInit {

  constructor() { }
  // Cart
  public cart: { id: number, qty: number, price: number }[] = cartitem;
  public calculateprice() {
    return this.cart.reduce((subtotal, item) => subtotal + item.qty * item.price, 0)
  };

  ngOnInit(): void {
  }

}
