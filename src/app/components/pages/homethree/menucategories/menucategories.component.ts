import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import products from "../../../../data/product.json";
import productcategory from "../../../../data/productcategory.json";
import { Category } from '../../menuone/category';
import { Item } from '../../menuone/item';

@Component({
  selector: 'app-menucategories',
  templateUrl: './menucategories.component.html',
  styleUrls: ['./menucategories.component.css']
})
export class MenucategoriesComponent implements OnInit {

  closeResult: string;
  modalContent: any;
  constructor(private modalService: NgbModal) { }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'customizeModal' });
  }
  items: Item[] = products;
  categories: Category[] = productcategory;
  filteredItems: Item[] = [...this.items];
  filterItemsByCategory(category: Category) {
    this.filteredItems = this.items.filter((item: Item) => {
      return item.category.includes(category.id);
    })
  }
  reset() {
    this.filteredItems = [...this.items];
  }
  settings = {
    slidesToShow: 8,
    slidesToScroll: 3,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 6
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
        }
      },
    ]
  };
  ngOnInit(): void {
  }

}
