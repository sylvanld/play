import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './Playlist';
import { trigger, transition, style, animate, state, query, group, stagger } from '@angular/animations';
import { SliderComponent } from '../slider/slider.component';

/*const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
      query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
          optional: true,
      }),
      query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
          optional: true,
      }),
  ]),
];
const right = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
      query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
          optional: true,
      }),
      query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
          optional: true,
      }),
  ]),
];*/

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
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

export class PlaylistsComponent implements OnInit {
  public playlists = []; //:Playlist[];
  switchMode = 0;  // 0: list ; 1: card
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

  newItem() {
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
    this.slider.show("Nouvelle Playlist", "<strong>content</strong>", params);
    //this.sliderStatus = true;
    //alert("menu new songs");
    // TODO: then update serviceData and items lists
  }

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
