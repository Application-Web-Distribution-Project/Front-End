import { AfterContentInit, Component } from '@angular/core';
import navigationmenu from '../../../data/navigation.json';

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.css']
})
export class MobilemenuComponent implements AfterContentInit {

  constructor() { }
  // Navigation
  public navigation: { id: number }[] = navigationmenu;
  open: boolean = false;
  trigger(item: { open: boolean; }){
    item.open = !item.open;
  }


  ngAfterContentInit(): void {
    
  }

}
