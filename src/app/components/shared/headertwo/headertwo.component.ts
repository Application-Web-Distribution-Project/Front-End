import { Component, OnInit } from '@angular/core';
import cartitem from '../../../data/cartlist.json';

@Component({
  selector: 'app-headertwo',
  templateUrl: './headertwo.component.html',
  styleUrls: ['./headertwo.component.css']
})
export class HeadertwoComponent implements OnInit {

  constructor() { }
  // navigation
  navmethod: boolean = true;
  toggleNav() {
    this.navmethod = !this.navmethod;
  }
  // Cart
  cartmethod: boolean = true;
  cartToggle() {
    this.cartmethod = !this.cartmethod;
  }
  // Search
  searchmethod: boolean = true;
  searchToggle() {
    this.searchmethod = !this.searchmethod;
  }
  // Cart
  public cart: { id: number}[] = cartitem;

  ngOnInit(): void {
  }

}
