import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teammember',
  templateUrl: './teammember.component.html',
  styleUrls: ['./teammember.component.css']
})
export class TeammemberComponent implements OnInit {

  constructor() { }
  teamblock = [
    {
      img: "assets/img/team/1.jpg",
      name: "Miranda Blue",
      designation: "Executive Chef",
    },
    {
      img: "assets/img/team/2.jpg",
      name: "Jonathan Flock",
      designation: "Assistant Chef",
    },
    {
      img: "assets/img/team/3.jpg",
      name: "Mich Jean",
      designation: "Assistant Chef",
    },
    {
      img: "assets/img/team/4.jpg",
      name: "Andrew Lumber",
      designation: "Assistant Chef",
    },
  ];

  ngOnInit(): void {
  }

}
