import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

const materialModules = [
	MatInputModule,
	MatFormFieldModule,
	MatSelectModule,
	MatButtonModule,
	MatIconModule,
	MatToolbarModule,
	MatSliderModule,
	MatSnackBarModule,
	MatCardModule,
	MatMenuModule,
	MatGridListModule,
	MatTableModule,
	MatCheckboxModule
];

@NgModule({
	declarations: [],
	imports: [CommonModule, ...materialModules],
	exports: materialModules
})
export class MaterialModule { }
