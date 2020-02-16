import { Component, OnInit, HostBinding, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss']
})
export class FloatingMenuComponent implements OnInit, OnDestroy {
  @Input() triggerLevel = 0;
  @Input() itemsAVisible: object[] = [];
  @Input() items: object[] = [];
  hideOptions = true;

  constructor() { }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
    this.hideOptions = (window.scrollY < this.triggerLevel);
  }
}
