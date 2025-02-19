import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
