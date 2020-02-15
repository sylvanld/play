import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { TimerPipePipe } from './pipes/timer-pipe.pipe';

import { PlayerService, PlayerConfigService } from './player.service';
import { PlayerComponent } from './views/player.component';

import { YoutubeComponent } from './views/youtube/youtube.component';
import { PlayerContainerComponent } from './components/player-container/player-container.component';

import { PlayerConfig } from '~types/player';

@NgModule({
  declarations: [
    TimerPipePipe,
    // entrypoint
    PlayerComponent,
    // components
    PlayerContainerComponent,
    // providers
    YoutubeComponent,
  ],
  providers: [PlayerService],
  exports: [PlayerComponent],
  imports: [CommonModule, MatSliderModule, MatButtonModule, MatIconModule, MatMenuModule]
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
