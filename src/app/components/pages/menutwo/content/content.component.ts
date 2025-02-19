import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import products from "../../../../data/product.json";
import productcategory from "../../../../data/productcategory.json";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  closeResult: string;
  modalContent: any;
  constructor(private modalService: NgbModal) { }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'customizeModal' });
  }
  public products: { id: number }[] = products;
  public productcategory: { id: number }[] = productcategory;
  
  public getProducts(categoryId = '') {
    return categoryId != '' ? products.filter( product => {
      return product.category.includes(categoryId)
    }) : products;
  }

  ngOnInit(): void {

  }

}
