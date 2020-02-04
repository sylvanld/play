import { Injectable } from '@angular/core';
import { SliderBarComponent } from './slider-bar/slider-bar.component';
import { SliderComponent } from './slider.component';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SliderAdapter {
    private sliderBar: SliderBarComponent;
    //private slider: SliderComponent;
    private title: String = "";
    private paramMenu: Object[] = null;
    private backAction = () => { this.sliderBar.hide() }
    //private backAction = () => { if (this.slider != null) this.slider.hide() }

    /*becomeSlider(slider: SliderComponent) {
        this.slider = slider;
    }*/

    becomeSliderController(sliderBar: SliderBarComponent) {
        this.sliderBar = sliderBar;
    }

    setBarTitle(title: string) {
        this.title = title;
    }

    setBarParamMenu(paramMenu: any) {
        this.paramMenu = paramMenu;
    }

    setBarBackAction(backAction: ()=>any) {
        this.backAction = backAction;
    }

    hideSlider() {
        if (this.sliderBar != null) {
            this.sliderBar.hide();
        }
    }

    showSlider() {
        if (this.sliderBar != null) {
            this.sliderBar.show();
        }
    }

    bindTitle()  {
        return of(this.title);
    }

    bindParamMenu()  {
        return of(this.paramMenu);
    }

    bindBackAction()  {
        return of(this.backAction);
    }
}