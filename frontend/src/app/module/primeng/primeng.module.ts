import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderModule } from 'primeng/slider';

const primengModules = [
  SliderModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...primengModules
  ],
  exports: primengModules
})
export class PrimengModule { }
