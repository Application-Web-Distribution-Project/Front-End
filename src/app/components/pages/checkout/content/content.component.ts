import { Component, OnInit } from '@angular/core';
import cartitem from '../../../../data/cartlist.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  public isOne = false;
  public isTwo = true;
  // Cart
  public cart: { id: number, qty: number, price: number }[] = cartitem;
  public calculateprice() {
    return this.cart.reduce((subtotal, item) => subtotal + item.qty * item.price, 0)
  };

  ngOnInit(): void {
  }

}
