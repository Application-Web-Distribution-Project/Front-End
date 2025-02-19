import { Component, OnInit } from '@angular/core';
import homebanner from '../../../../data/homethreebanner.json';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  constructor() { }
  public banner: { id: number, img:string }[] = homebanner;
  settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    centerMode: true,
    prevArrow: '.banner-3 .slider-prev',
    nextArrow: '.banner-3 .slider-next',
    centerPadding: '80px',
    focusOnSelect: true,
    responsive: [{
      breakpoint: 1400,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 991,
      settings: {
        variableWidth: false,
        centerPadding: '0px',
        centerMode: false,
        arrows: false,
        autoplay: true,
        slidesToShow: 1
      }
    }
    ]
  }
  ngOnInit(): void {
  }

}
