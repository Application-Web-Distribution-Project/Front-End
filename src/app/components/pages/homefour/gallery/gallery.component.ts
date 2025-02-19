import { Component, OnInit } from '@angular/core';
import insta from '../../../../data/insta.json';
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor() { }
  public insta: { id: number }[] = insta;

  ngOnInit(): void {
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
