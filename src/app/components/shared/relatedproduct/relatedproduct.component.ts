import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import products from "../../../data/product.json";

@Component({
  selector: 'app-relatedproduct',
  templateUrl: './relatedproduct.component.html',
  styleUrls: ['./relatedproduct.component.css']
})
export class RelatedproductComponent implements OnInit {

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
