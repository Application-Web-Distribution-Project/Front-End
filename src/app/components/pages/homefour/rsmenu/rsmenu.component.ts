import { Component, OnInit } from '@angular/core';
import pizzamenu from '../../../../data/pizzamenu.json';

@Component({
  selector: 'app-rsmenu',
  templateUrl: './rsmenu.component.html',
  styleUrls: ['./rsmenu.component.css']
})
export class RsmenuComponent implements OnInit {

  constructor() { }
  public pizzamenu: { id: number }[] = pizzamenu;

  ngOnInit(): void {
  }

}
