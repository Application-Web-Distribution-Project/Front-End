import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogfull',
  templateUrl: './blogfull.component.html',
  styleUrls: ['./blogfull.component.css']
})
export class BlogfullComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
