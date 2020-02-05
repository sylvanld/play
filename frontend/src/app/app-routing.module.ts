import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaytechComponent } from './view/playtech/playtech.component';
import { BrowseComponent } from './view/browse/browse.component';
import { ShareComponent } from './view/share/share.component';
import { AccountsComponent } from './view/accounts/accounts.component';
import { PlayerComponent } from './view/player/player.component';
import { PlaylistCreationComponent } from './component/playlist/playlist-creation/playlist-creation.component';
import { PlaylistEditionComponent } from './component/playlist/playlist-edition/playlist-edition.component';

const playlistRoutes: Routes = [
  { path: 'create', component: PlaylistCreationComponent },
  { path: 'edit/:id', component: PlaylistEditionComponent }
];

const routes: Routes = [
  { path: 'player', component: PlayerComponent },
  { path: 'playtech', component: PlaytechComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'share', component: ShareComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'playlist', children: playlistRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
