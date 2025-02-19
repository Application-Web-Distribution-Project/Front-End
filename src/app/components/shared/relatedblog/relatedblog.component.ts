import { Component, OnInit } from '@angular/core';
import blog from '../../../data/blog.json';

@Component({
  selector: 'app-relatedblog',
  templateUrl: './relatedblog.component.html',
  styleUrls: ['./relatedblog.component.css']
})
export class RelatedblogComponent implements OnInit {

  constructor() { }
  public blogpost: { id: number }[] = blog;
  settings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    responsive: [{
      breakpoint: 575,
      settings: {
        slidesToShow: 1
      }
    }]
  }

  ngOnInit(): void {
  }

}
