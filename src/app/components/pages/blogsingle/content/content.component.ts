import { Component, AfterContentInit } from '@angular/core';
import blogpost from '../../../../data/blog.json';
import blogtags from '../../../../data/blogtags.json';
import { ActivatedRoute } from '@angular/router';
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements AfterContentInit {

  constructor(private router: ActivatedRoute) { }
  public blogdetails: { id: number }[] = blogpost;
  public blogtags: { id: number }[] = blogtags;
  public getBlogTags(items: string | any[]) {
    var elems = blogtags.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  }
  public setPost(id: any) {
    this.blogdetails = blogpost.filter((item: { id: any; }) => { return item.id == id });
  }

  ngAfterContentInit(): void {
    this.setPost(this.router.snapshot.params.id);
    function popup() {
      ($('.gallery-thumb') as any).magnificPopup({
        type: 'image',
        gallery: {
          enabled: true
        },
      });
    }
    popup()
  }

}
