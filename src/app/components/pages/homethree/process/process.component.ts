import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  constructor() { }
  processpost = [
    {
      icon: "flaticon-online-booking",
      title: "Order",
      text: "There are many variations of passages of Lorem Ipsum available"
    },
    {
      icon: "flaticon-calories",
      title: "Cook",
      text: "There are many variations of passages of Lorem Ipsum available"
    },
    {
      icon: "flaticon-delivery-man",
      title: "Deliver",
      text: "There are many variations of passages of Lorem Ipsum available"
    },
    {
      icon: "flaticon-food-tray",
      title: "Enjoy",
      text: "There are many variations of passages of Lorem Ipsum available"
    }
  ]

  ngOnInit(): void {
  }

}
