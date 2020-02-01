import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  title: String = "";
  content: String = "";
  paramMenu: String = "";
  status: boolean = false;
  //@Input() title: String = "";
  //@Input() parameters: String = null;
  //@Input() status: boolean = false;
  //@Output() statusChange = new EventEmitter<boolean>();
  @HostBinding('class.active')
    public get isActive(): boolean {
      return this.status;
    }
  
  constructor() { }

  ngOnInit() {
  }

  /*showSlider() {
    this.status = true;
    this.statusChange.emit(this.status);
  }*/

  hide() {
    this.status = false;
    //this.statusChange.emit(this.status);
  }

  show(title=null, content=null, paramMenu=null) {
    if (this.title !== null) this.title = title;
    if (this.content !== null) this.content = content;
    if (this.paramMenu !== null) this.paramMenu = paramMenu;
    this.status = true;
  }
}
