import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
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
import { TracksQueueComponent } from './components/tracks-queue/tracks-queue.component';

@NgModule({
  declarations: [
    TimerPipePipe,
    // entrypoint
    PlayerComponent,
    // components
    PlayerContainerComponent,
    // providers
    YoutubeComponent,
    TracksQueueComponent,
  ],
  providers: [PlayerService],
  exports: [PlayerComponent],
  imports: [CommonModule, MatSliderModule, MatListModule, MatButtonModule, MatIconModule, MatMenuModule],
  entryComponents: [TracksQueueComponent]
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
