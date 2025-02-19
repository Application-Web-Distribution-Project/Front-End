import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogsingle',
  templateUrl: './blogsingle.component.html',
  styleUrls: ['./blogsingle.component.css']
})
export class BlogsingleComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
