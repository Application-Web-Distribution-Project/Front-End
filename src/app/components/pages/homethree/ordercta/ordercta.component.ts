import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-ordercta',
  templateUrl: './ordercta.component.html',
  styleUrls: ['./ordercta.component.css']
})
export class OrderctaComponent implements OnInit {

  constructor() { }
  gallery = [
    {
      img: "assets/img/blog/2.jpg"
    },
    {
      img: "assets/img/blog/3.jpg"
    },
    {
      img: "assets/img/blog/4.jpg"
    },
    {
      img: "assets/img/blog/5.jpg"
    },
    {
      img: "assets/img/blog/6.jpg"
    },
    {
      img: "assets/img/blog/8.jpg"
    }
  ];
  settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: false,
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
      }
    }
    ]
  };


  ngOnInit(): void {
    function popup() {
      ($('.gallery-thumb') as any).magnificPopup({
        type: 'image',
        gallery: {
          enabled: true
        },
      });
    }
    popup()
  }

}
