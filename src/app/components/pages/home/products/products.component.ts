import { Component, OnInit } from '@angular/core';
import products from '../../../../data/product.json';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  closeResult: string;
  modalContent: any;
  constructor(private modalService: NgbModal) { }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'customizeModal' });
  }
  
  public products: { id: number }[] = products;
  settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: '.products-section .slider-prev',
    nextArrow: '.products-section .slider-next',
    dots: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  }

  ngOnInit(): void {
  }

}
