import { Component, OnInit, HostBinding, ViewChild, ContentChild, Directive, Input, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { SliderBarComponent } from './slider-bar/slider-bar.component';
import { SliderAdapter } from './sliderAdapter.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @ViewChild(SliderBarComponent, {static: false}) sliderBar:SliderBarComponent;
  
  @HostBinding('class.active')
  public get isActive(): boolean {
    return this.status;
  }

  status: boolean = false;
  
  constructor(private sliderAdapter: SliderAdapter) { }

  ngOnInit() {
    this.sliderAdapter.becomeSlider(this);
  }

  show() {
    this.status = true;
  }

  hide() {
    this.status = false;
  }
}
