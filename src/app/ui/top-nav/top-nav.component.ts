import { Component } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {

  show = false;

  constructor() { }

  toggleCollapse() {
    this.show = !this.show
  }

}
