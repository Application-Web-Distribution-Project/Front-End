import { Component, AfterContentInit } from '@angular/core';
import products from '../../../../data/product.json';
import blogtags from '../../../../data/blogtags.json';
import productcategory from '../../../../data/productcategory.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements AfterContentInit {

  constructor(private router: ActivatedRoute) { }
  public productdetails = products;
  public blogtags = blogtags;
  public productcategory = productcategory;
  public getBlogTags(items: string | any[]) {
    var elems = blogtags.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }
  public getProductCategory(items: string | any[]) {
    var elems = productcategory.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }
  public setProducts(id: any) {
    this.productdetails = products.filter((item: { id: any; }) => { return item.id == id });
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
    this.setProducts(this.router.snapshot.params.id);

  }

}
