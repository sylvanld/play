import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SliderAdapter } from '../sliderAdapter.service';

@Component({
  selector: 'app-slider-bar',
  templateUrl: './slider-bar.component.html',
  styleUrls: ['./slider-bar.component.scss']
})
export class SliderBarComponent implements OnInit {
  @Input() showSlider: boolean;
  @Output() showSliderChange: EventEmitter<any> = new EventEmitter();
  
  @Input() title: String = "";
  paramMenu: Object[] = null;
  backAction = () => { this.hide() }

  constructor(private sliderAdapter: SliderAdapter) { }

  ngOnInit() {
    this.sliderAdapter.becomeSliderController(this);
    this.sliderAdapter.bindTitle().subscribe((title) => { this.title = title; });
    this.sliderAdapter.bindParamMenu().subscribe((paramMenu) => { this.paramMenu = paramMenu; });
    this.sliderAdapter.bindBackAction().subscribe((backAction) => { this.backAction = backAction; });
  }

  hide() {
    console.log('send hide slider')
    this.showSlider = false;
    this.showSliderChange.emit(this.showSlider);
  }

  show() {
    console.log('send show slider')
    this.showSlider = true;
    this.showSliderChange.emit(this.showSlider);
  }
}
