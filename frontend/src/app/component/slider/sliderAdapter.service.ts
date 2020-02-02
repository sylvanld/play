import { Injectable } from '@angular/core';
import { SliderComponent } from './slider.component';

@Injectable({
    providedIn: 'root'
})
export class SliderAdapter {
    private slider: SliderComponent;

    becomeSlider(slider: SliderComponent) {
        this.slider = slider;
        this.slider.sliderBar
    }

    setBarTitle(title: string) {
        if (this.slider != null) {
            this.slider.sliderBar.title = title;
        }
        
    }

    setBarParamMenu(paramMenu: any) {
        if (this.slider != null) {
            this.slider.sliderBar.paramMenu = paramMenu;
        }
    }

    setBarBackAction(backAction: ()=>{}) {
        if (this.slider != null) {
            this.slider.sliderBar.backAction = backAction;
        }
    }

    hideSlider() {
        if (this.slider != null) {
            this.slider.sliderBar.hide();
        }
    }
}