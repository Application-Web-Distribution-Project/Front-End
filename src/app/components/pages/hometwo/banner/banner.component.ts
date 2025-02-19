import { Component, OnInit } from '@angular/core';
import homebanner from '../../../../data/hometwobanner.json';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  constructor() { }
  public banner: { id: number }[] = homebanner;
  settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    responsive: [{
      breakpoint: 768,
      settings: {
        dots: false,
      }
    }]
  }

  ngOnInit(): void {
  }

}
