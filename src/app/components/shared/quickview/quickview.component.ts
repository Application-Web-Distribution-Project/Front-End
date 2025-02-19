import { Component, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import products from '../../../data/product.json';

@Component({
  selector: 'app-quickview',
  templateUrl: './quickview.component.html',
  styleUrls: ['./quickview.component.css']
})
export class QuickviewComponent implements AfterContentInit {

  constructor(private router: ActivatedRoute) { }
  public products: { id: number }[] = products;

  public setPost(id: any) {
    this.products = products.filter((item: { id: any; }) => { return item.id == id });
  }
  // Increment decrement
  public counter: number = 1
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }

  ngAfterContentInit(): void {
    this.setPost(this.router.snapshot.params.id);
  }

}
