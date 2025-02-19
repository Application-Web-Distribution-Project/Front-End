import { Component, OnInit } from '@angular/core';
import cartitem from '../../../data/cartlist.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

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
