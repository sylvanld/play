import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

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
	MatCheckboxModule,
	MatChipsModule,
	MatAutocompleteModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatTabsModule,
	MatDialogModule
];

@NgModule({
	declarations: [],
	providers: [NativeDateAdapter],
	imports: [CommonModule, ...materialModules],
	exports: materialModules
})
export class MaterialModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: MaterialModule,
			providers: [NativeDateAdapter]
		};
	}
}
