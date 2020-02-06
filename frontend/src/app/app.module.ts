import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './module/material/material.module';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchbarComponent } from './component/search/search-bar/search-bar.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { NavItemComponent } from './component/navigation/nav-item/nav-item.component';
import { HeadingComponent } from './component/navigation/heading/heading.component';
import { PlayerComponent } from './view/player/player.component';
import { ShareComponent } from './view/share/share.component';
import { AccountsComponent } from './view/accounts/accounts.component';
import { BrowseComponent } from './view/browse/browse.component';
import { PlaytechComponent } from './view/playtech/playtech.component';
import { ArtistsListComponent } from './component/items/artists/artists-list/artists-list.component';
import { ArtistItemComponent } from './component/items/artists/artist-item/artist-item.component';
import { SearchResultsComponent } from './component/search/search-results/search-results.component';
import { ListviewComponent } from './component/playlist/view/listview/listview.component';
import { CardviewComponent } from './component/playlist/view/cardview/cardview.component';
import { ViewToggleComponent } from './component/playlist/view/view-toggle/view-toggle.component';
import { PlaylistEditionComponent } from './component/playlist/playlist-edition/playlist-edition.component';
import { FloatingMenuComponent } from './component/floating-menu/floating-menu.component';
import { PlaylistCreationComponent } from './component/playlist/playlist-creation/playlist-creation.component';
import { LoginComponent } from './view/login/login.component';
import { RegisterComponent } from './view/register/register.component';
import { FormComponent } from './component/core/form/form.component';

import { PlayerModule } from './module/player/player.module';
import { DeezerModule } from './module/deezer/deezer.module';

import { SpotifyLoginButtonComponent } from './component/auth/spotify-login-button/spotify-login-button.component';
import { DeezerLoginButtonComponent } from './component/auth/deezer-login-button/deezer-login-button.component';

import { AlbumsListComponent } from './component/items/albums/albums-list/albums-list.component';
import { AlbumItemComponent } from './component/items/albums/album-item/album-item.component';
import { TracksListComponent } from './component/items/tracks/tracks-list/tracks-list.component';
import { SelectList } from './component/core/select-list/select-list.component';
import { AdvancedSearchComponent } from './component/search/advanced-search/advanced-search.component';
import { ForgetAccountDialogComponent } from './component/forget-account-dialog/forget-account-dialog.component';
import { PrimengModule } from '~primeng/primeng.module';
import { InputArtistsComponent } from './component/search/filters/input-artists/input-artists.component';
import { AutocompleteChipListComponent } from './component/core/autocomplete-chip-list/autocomplete-chip-list.component';
import { InputAlbumsComponent } from './component/search/filters/input-albums/input-albums.component';
import { InputGenresComponent } from './component/search/filters/input-genres/input-genres.component';
import { InputDatesComponent } from './component/search/filters/input-dates/input-dates.component';
import { InputTempoComponent } from './component/search/filters/input-tempo/input-tempo.component';
import { ProsodicsFiltersComponent } from './component/search/advanced-search/prosodics-filters/prosodics-filters.component';
import { SimpleFiltersComponent } from './component/search/advanced-search/simple-filters/simple-filters.component';

@NgModule({
	declarations: [
		AppComponent,
		ListviewComponent,
		CardviewComponent,
		ViewToggleComponent,
		FloatingMenuComponent,
		PlaylistEditionComponent,
		PlaylistCreationComponent,
		SearchbarComponent,
		NavigationComponent,
		NavItemComponent,
		HeadingComponent,
		PlayerComponent,
		ShareComponent,
		AccountsComponent,
		BrowseComponent,
		PlaytechComponent,
		ArtistsListComponent,
		ArtistItemComponent,
		SearchResultsComponent,
		LoginComponent,
		RegisterComponent,
		FormComponent,
		SpotifyLoginButtonComponent,
		DeezerLoginButtonComponent,
		AlbumsListComponent,
		AlbumItemComponent,
		TracksListComponent,
		SelectList,
		AdvancedSearchComponent,
		ForgetAccountDialogComponent,
		InputArtistsComponent,
		AutocompleteChipListComponent,
		InputAlbumsComponent,
		InputGenresComponent,
		InputDatesComponent,
		InputTempoComponent,
		ProsodicsFiltersComponent,
		SimpleFiltersComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		MaterialModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatMenuModule,
		MatButtonModule,
		DragDropModule,
		MatStepperModule,
		ReactiveFormsModule,
		MatRadioModule,
		YouTubePlayerModule,
		HttpClientModule,
		MatDialogModule,
		PrimengModule,
		// custom modules
		DeezerModule,
		PlayerModule.forRoot({ selection: 'youtube' })
	],
	entryComponents: [ForgetAccountDialogComponent, AdvancedSearchComponent],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
		iconRegistry.addSvgIcon('play_logo', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/play.svg'));
	}
}
