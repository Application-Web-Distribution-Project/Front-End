import { Component, OnInit } from '@angular/core';
import pizzamenu from '../../../../data/pizzamenu.json';
import pastamenu from '../../../../data/pastamenu.json';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor() { }
  public pizzamenu: { id: number }[] = pizzamenu;
  public pastamenu: { id: number }[] = pastamenu;

  ngOnInit(): void {
  }

}
