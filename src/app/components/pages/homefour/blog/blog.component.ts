import { Component, OnInit } from '@angular/core';
import blog from '../../../../data/blog.json';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  constructor() { }
  public blogpost: { id: number }[] = blog;

  ngOnInit(): void {
  }

}
