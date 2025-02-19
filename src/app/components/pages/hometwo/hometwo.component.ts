import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hometwo',
  templateUrl: './hometwo.component.html',
  styleUrls: ['./hometwo.component.css']
})
export class HometwoComponent implements OnInit {
  // Footer style
  classname = "ct-footer";
  ftlogo = "assets/img/logo.png"
  constructor() { }

  ngOnInit(): void {
  }

}
