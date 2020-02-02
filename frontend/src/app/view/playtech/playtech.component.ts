import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistsService } from '../../view/playtech/playlists.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SliderComponent } from 'src/app/component/slider/slider.component';

@Component({
  selector: 'app-playtech',
  templateUrl: './playtech.component.html',
  styleUrls: ['./playtech.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        query('.list-item', [
          style({opacity: 0, transform: 'translateX(-100px)'}),
          stagger(30, [
            animate('0.2s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})

export class PlaytechComponent implements OnInit {
  public playlists = []; //:Playlist[];
  switchMode:number = 0;  // 0: list ; 1: card
  //sliderStatus = false;
  @ViewChild(SliderComponent, {static: false}) slider:SliderComponent;

  constructor(private data: PlaylistsService) { }

  ngOnInit() {
    this.data.getMyPlaylists().subscribe(
      //playlists => this.playlists = playlists
      playlists => {
        for (let idx in playlists) {
          this.playlists.push({
            picture: playlists[idx].picture,
            mainContent: playlists[idx].title,
            secondaryContent: playlists[idx].author
          })
        }
      }
    );
  }

  addPlaylist() {
    this.slider.show();
    //TODO autosave
  }

  movePlaylist(event) {
    moveItemInArray(this.playlists, event.oldIndex, event.newIndex);
    //TODO autosave
  }

  delPlaylist(index) {
    this.playlists.splice(index, 1);
    //TODO autosave
  }

  /*newItem() {
    let params = [
      {
        icon: 'dialpad',
        label: 'param1',
        onClick: () => { alert('clicked param 1') }
      },
      {
        icon: 'voicemail',
        label: 'param2',
        onClick: () => { alert('clicked param 2') }
      },
      {
        icon: 'notifications_off',
        label: 'param3',
        onClick: () => { alert('clicked param 3') }
      }
    ]
    //this.slider.show("Nouvelle Playlist", "<strong>content</strong>", params);
    this.slider.show("Nouvelle Playlist")
    //this.sliderStatus = true;
    //alert("menu new songs");
    // TODO: then update serviceData and items lists
  }*/

  onSwitchMode(mode) {
    this.switchMode = mode;
  }

  isListMode():boolean {
    return this.switchMode === 0
  }

  isCardMode():boolean {
    return this.switchMode === 1
  }
}
