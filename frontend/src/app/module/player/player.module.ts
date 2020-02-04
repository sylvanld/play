import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerComponent } from './components/player/player.component';
import { PlayerService, PlayerConfigService } from './services/player.service';

import { YouTubePlayerModule } from '@angular/youtube-player';
import { ProvidersComponent } from './components/providers/providers.component';

import { PlayerConfig } from './services/player.types';
import { PlayerControlsComponent } from './components/player/player-controls/player-controls.component';
import { PlayerExtraControlsComponent } from './components/player/player-extra-controls/player-extra-controls.component';
import { TimerPipePipe } from './pipes/timer-pipe.pipe';

// angular material dependencies
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PlayerComponent, ProvidersComponent, PlayerControlsComponent, PlayerExtraControlsComponent, TimerPipePipe],
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
