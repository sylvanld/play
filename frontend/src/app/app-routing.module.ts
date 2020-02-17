import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaytechComponent } from './view/playtech/playtech.component';
import { BrowseComponent } from './view/browse/browse.component';
import { ShareComponent } from './view/share/share.component';
import { AccountsComponent } from './view/accounts/accounts.component';
import { PlayerComponent } from './view/player/player.component';
import { PlaylistEditionComponent } from './view/playtech/playlist-edition/playlist-edition.component';
import { LoginComponent } from './view/login/login.component';
import { RegisterComponent } from './view/register/register.component';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { NotAuthenticatedGuard } from './guard/not-authenticated.guard';
import { ConvertComponent } from './view/convert/convert.component';
import { ImportComponent } from './view/convert/import/import.component';
import { ExportComponent } from './view/convert/export/export.component';
import { FriendshipComponent } from './view/friendship/friendship.component';


const routes: Routes = [
  { path: 'player', component: PlayerComponent, canActivate: [AuthenticatedGuard] },
  { path: 'playtech', component: PlaytechComponent, canActivate: [AuthenticatedGuard] },
  { path: 'browse', component: BrowseComponent, canActivate: [AuthenticatedGuard] },
  { path: 'share', component: ShareComponent, canActivate: [AuthenticatedGuard] },
  { path: 'friendship', component: FriendshipComponent, canActivate: [AuthenticatedGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthenticatedGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthenticatedGuard] },
  //
  {
    path: 'convert', component: ConvertComponent, canActivate: [AuthenticatedGuard], children: [
      { path: 'import', component: ImportComponent },
      { path: 'export', component: ExportComponent }
    ]
  },
  //
  {
    path: 'playlist', canActivate: [AuthenticatedGuard], children: [
      { path: 'edit/:id', component: PlaylistEditionComponent }, // edit playlist
      { path: 'edit', component: PlaylistEditionComponent }      // new playlist
    ]
  },
  // redirection
  { path: '', redirectTo: 'playtech', pathMatch: 'prefix' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
