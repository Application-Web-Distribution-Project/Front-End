import { Component, OnInit } from '@angular/core';
import blog from '../../../../data/blog.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  public blogpost: { id: number }[] = blog;


  ngOnInit(): void {
  }

}
