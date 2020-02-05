import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './module/material/material.module';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchbarComponent } from './component/search/search-bar/search-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIconRegistry } from '@angular/material/icon';
import { LoginComponent } from './view/login/login.component';
import { RegisterComponent } from './view/register/register.component';
import { FormComponent } from './component/core/form/form.component';

import { PlayerModule } from './module/player/player.module';
import { DeezerModule } from '~deezer/deezer.module';

import { SpotifyLoginButtonComponent } from './component/auth/spotify-login-button/spotify-login-button.component';
import { DeezerLoginButtonComponent } from './component/auth/deezer-login-button/deezer-login-button.component';

import { AlbumsListComponent } from './component/items/albums/albums-list/albums-list.component';
import { AlbumItemComponent } from './component/items/albums/album-item/album-item.component';
import { TracksListComponent } from './component/items/tracks/tracks-list/tracks-list.component';
import { SelectItemTypeComponent } from './component/filters/select-item-type/select-item-type.component';

@NgModule({
	declarations: [
		AppComponent,
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
		SelectItemTypeComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,

		// custom modules
		DeezerModule,
		PlayerModule.forRoot({ selection: 'youtube' })
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {
	constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
		iconRegistry.addSvgIcon('play_logo', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/play.svg'));
	}
}
