import { Component, OnInit } from '@angular/core';
import products from '../../../../data/product.json';
import productcategory from '../../../../data/productcategory.json';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor() { }
  public products: { id: number }[] = products;
  public productcategory: { id: number }[] = productcategory;

  public getCategory(items: string | any[]) {
    var elems = productcategory.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }
  settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    prevArrow: '.category-section .slider-prev',
    nextArrow: '.category-section .slider-next',
    responsive: [{
      breakpoint: 768,
      settings: {
        dots: false,
        autoplay: true
      }
    }]
  }
  ngOnInit(): void {
  }

}
