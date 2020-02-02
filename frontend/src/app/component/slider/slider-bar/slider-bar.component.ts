import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-slider-bar',
  templateUrl: './slider-bar.component.html',
  styleUrls: ['./slider-bar.component.scss']
})
export class SliderBarComponent implements OnInit {
  @Input() showSlider: boolean;
  @Output() showSliderChange: EventEmitter<any> = new EventEmitter();
  
  title: String = "";
  paramMenu: Object[] = null;
  backAction = () => { this.hide() }

  constructor() { }

  ngOnInit() {
  }

  hide() {
    console.log('send hide slider')
    this.showSlider = false;
    this.showSliderChange.emit(this.showSlider);
  }
}
