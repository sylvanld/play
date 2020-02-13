import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaytechComponent } from './view/playtech/playtech.component';
import { BrowseComponent } from './view/browse/browse.component';
import { ShareComponent } from './view/share/share.component';
import { AccountsComponent } from './view/accounts/accounts.component';
import { PlayerComponent } from './view/player/player.component';
import { PlaylistCreationComponent } from './component/playlist/playlist-creation/playlist-creation.component';
import { PlaylistEditionComponent } from './component/playlist/playlist-edition/playlist-edition.component';
import { LoginComponent } from './view/login/login.component';
import { RegisterComponent } from './view/register/register.component';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { NotAuthenticatedGuard } from './guard/not-authenticated.guard';


const routes: Routes = [
  { path: 'player', component: PlayerComponent, canActivate: [AuthenticatedGuard] },
  { path: 'playtech', component: PlaytechComponent, canActivate: [AuthenticatedGuard] },
  { path: 'browse', component: BrowseComponent, canActivate: [AuthenticatedGuard] },
  { path: 'share', component: ShareComponent, canActivate: [AuthenticatedGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthenticatedGuard] },
  { path: '', redirectTo: 'playtech', pathMatch: 'prefix' },
  //
  { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthenticatedGuard] },
  //
  {
    path: 'playlist', children: [
      { path: 'create', component: PlaylistCreationComponent },
      { path: 'edit/:id', component: PlaylistEditionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
