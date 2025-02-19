import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogmasonry',
  templateUrl: './blogmasonry.component.html',
  styleUrls: ['./blogmasonry.component.css']
})
export class BlogmasonryComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
