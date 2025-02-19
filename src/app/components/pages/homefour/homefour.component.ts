import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homefour',
  templateUrl: './homefour.component.html',
  styleUrls: ['./homefour.component.css']
})
export class HomefourComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
