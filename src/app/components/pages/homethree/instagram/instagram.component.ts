import { Component, OnInit } from '@angular/core';
import insta from '../../../../data/insta.json';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css']
})
export class InstagramComponent implements OnInit {

  constructor() { } 
  public insta: { id: number }[] = insta;

  ngOnInit(): void {
  }

}
