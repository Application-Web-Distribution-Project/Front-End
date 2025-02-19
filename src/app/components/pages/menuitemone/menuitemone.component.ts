import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menuitemone',
  templateUrl: './menuitemone.component.html',
  styleUrls: ['./menuitemone.component.css']
})
export class MenuitemoneComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
