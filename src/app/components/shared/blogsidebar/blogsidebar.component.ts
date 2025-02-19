import { Component, OnInit } from '@angular/core';
import blog from '../../../data/blog.json';
import blogtags from '../../../data/blogtags.json';

@Component({
  selector: 'app-blogsidebar',
  templateUrl: './blogsidebar.component.html',
  styleUrls: ['./blogsidebar.component.css']
})
export class BlogsidebarComponent implements OnInit {

  constructor() { }
  public blogpost: { id: number }[] = blog;
  public blogtags: { id: number }[] = blogtags;

  ngOnInit(): void {
  }

}
