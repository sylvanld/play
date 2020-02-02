import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './lib/material/material.module';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

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
import { SliderComponent } from './component/slider/slider.component';
import { ViewToggleComponent } from './component/playlist/view/view-toggle/view-toggle.component';
import { PlaylistEditionComponent } from './component/playlist/playlist-edition/playlist-edition.component';
import { FloatingMenuComponent } from './component/floating-menu/floating-menu.component';
import { FilteredPlaylistGenComponent } from './component/playlist/filtered-playlist-gen/filtered-playlist-gen.component';
import { ExternalPlaylistGenComponent } from './component/playlist/external-playlist-gen/external-playlist-gen.component';
import { PlaylistCreationStepperComponent } from './component/playlist/playlist-creation-stepper/playlist-creation-stepper.component';
import { SliderBarComponent } from './component/slider/slider-bar/slider-bar.component';

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
    ListviewComponent,
    CardviewComponent,
    SliderComponent,
    ViewToggleComponent,
    ViewToggleComponent,
    FloatingMenuComponent,
    PlaylistEditionComponent,
    FilteredPlaylistGenComponent,
    ExternalPlaylistGenComponent,
    PlaylistCreationStepperComponent,
    SliderBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    DragDropModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'play_logo',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/play.svg')
    );
  }
}
