import { Component, OnInit } from '@angular/core';
import blog from '../../../../data/blog.json'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  // pagination
  page: number = 1;
  constructor() { }
  public blogpost = blog;


  ngOnInit(): void {
  }

}
