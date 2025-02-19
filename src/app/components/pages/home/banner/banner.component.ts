import { Component, OnInit } from '@angular/core';
import homebanner from '../../../../data/homebanner.json';

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
    asNavFor: '.banner-slider-nav-inner',
    dots: false,
    responsive: [{
      breakpoint: 768,
      settings: {
        arrows: false,
      }
    }]
  }
  settingsthumb = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    prevArrow: '.banner-slider-nav .slider-prev',
    nextArrow: '.banner-slider-nav .slider-next',
    asNavFor: '.banner-slider',
    focusOnSelect: true,
    responsive: [{
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        autoplay: true
      }
    }
    ]
  }

  ngOnInit(): void {
  }

}
