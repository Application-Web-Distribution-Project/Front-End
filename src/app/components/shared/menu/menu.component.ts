import { Component, OnInit } from '@angular/core';
import navigationmenu from '../../../data/navigation.json';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }
  // Navigation
  public navigation: { id: number }[] = navigationmenu;

  ngOnInit(): void {
  }

}
