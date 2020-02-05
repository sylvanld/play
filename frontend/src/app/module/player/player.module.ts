import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { YouTubePlayerModule } from '@angular/youtube-player';

// services
import { PlayerConfig } from '~types/player';
import { PlayerService, PlayerConfigService } from './player.service';

// components
import { PlayerComponent } from './components/player/player.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { PlayerControlsComponent } from './components/player/player-controls/player-controls.component';
import { PlayerCurrentTrackComponent } from './components/player/player-current-track/player-current-track.component';
import { PlayerExtraControlsComponent } from './components/player/player-extra-controls/player-extra-controls.component';

// custom pipes
import { TimerPipePipe } from './pipes/timer-pipe.pipe';

// angular material dependencies
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TimerPipePipe,
    PlayerComponent,
    ProvidersComponent,
    PlayerControlsComponent,
    PlayerCurrentTrackComponent,
    PlayerExtraControlsComponent,
  ],
  providers: [],
  exports: [PlayerComponent],
  imports: [CommonModule, YouTubePlayerModule, MatSliderModule, MatButtonModule, MatIconModule, MatMenuModule, FormsModule]
})
export class PlayerModule {
  static forRoot(config: PlayerConfig): ModuleWithProviders {
    return {
      ngModule: PlayerModule,
      providers: [
        PlayerService,
        {
          provide: PlayerConfigService,
          useValue: config
        }
      ]
    };
  }
}
