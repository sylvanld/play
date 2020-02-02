import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './lib/material/material.module';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {YouTubePlayerModule} from '@angular/youtube-player';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchbarComponent } from './component/search/search-bar/search-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
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
import { BottomPlayerComponent } from './component/player/bottom-player/bottom-player.component';
import { MatIconRegistry } from '@angular/material/icon';
import { TimerPipePipe } from './pipes/timer-pipe.pipe';

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
    TimerPipePipe,
    BottomPlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    YouTubePlayerModule,
    HttpClientModule
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
