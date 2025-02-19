import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menutwo',
  templateUrl: './menutwo.component.html',
  styleUrls: ['./menutwo.component.css']
})
export class MenutwoComponent implements OnInit {
// Footer style
classname = "ct-footer footer-dark";
ftlogo = "assets/img/logo-light.png"
  constructor() { }

  ngOnInit(): void {
  }

}
