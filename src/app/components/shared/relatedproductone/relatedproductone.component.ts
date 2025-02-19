import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import products from "../../../data/product.json";

@Component({
  selector: 'app-relatedproductone',
  templateUrl: './relatedproductone.component.html',
  styleUrls: ['./relatedproductone.component.css']
})
export class RelatedproductoneComponent implements OnInit {

  closeResult: string;
  modalContent: any;
  constructor(private modalService: NgbModal) { }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'customizeModal' });
  }
  public products: { id: number }[] = products;

  ngOnInit(): void {
  }

}
