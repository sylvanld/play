import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss']
})
export class FloatingMenuComponent implements OnInit {
  @Input() triggerLevel:number = 0;
  @Input() itemsAVisible:Array<Object> = [];
  @Input() items:Array<Object> = [];
  hideOptions:boolean = true;

  constructor() { }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
    this.hideOptions = (window.scrollY < this.triggerLevel);
  };
}
