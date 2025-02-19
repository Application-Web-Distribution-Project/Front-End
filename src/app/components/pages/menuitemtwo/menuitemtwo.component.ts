import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menuitemtwo',
  templateUrl: './menuitemtwo.component.html',
  styleUrls: ['./menuitemtwo.component.css']
})
export class MenuitemtwoComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
