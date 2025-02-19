import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infographics',
  templateUrl: './infographics.component.html',
  styleUrls: ['./infographics.component.css']
})
export class InfographicsComponent implements OnInit {

  constructor() { }
  successpost = [
    {
      icon: "flaticon-employee",
      count: 24934,
      title: "Happy Customers"
    },
    {
      icon: "flaticon-pizza-slice",
      count: 65317,
      title: "Pizzas Made"
    },
    {
      icon: "flaticon-cheese",
      count: 4658,
      title: "Cheese Rolls"
    },
    {
      icon: "flaticon-soda",
      count: 67335,
      title: "Drinks Served"
    }
  ]

  ngOnInit(): void {
  }

}
