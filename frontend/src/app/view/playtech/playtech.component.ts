import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistsService } from '../../view/playtech/playlists.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SliderComponent } from 'src/app/component/slider/slider.component';
import { Playlist } from 'src/app/classes/Playlist';
import { ViewItem } from 'src/app/classes/ViewItem';
import { SliderAdapter } from 'src/app/component/slider/sliderAdapter.service';

@Component({
  selector: 'app-playtech',
  templateUrl: './playtech.component.html',
  styleUrls: ['./playtech.component.scss']
})

export class PlaytechComponent implements OnInit {
  playlists: Playlist[] = [];
  playlistsF: ViewItem[] = [];
  switchMode: number = 0;  // 0: list ; 1: card
  locked: boolean = false;
  sliderPlaylistCreation: boolean = true;
  selectedPlaylistId: string = null;

  @ViewChild(SliderComponent, {static: false}) slider: SliderComponent;

  constructor(private data: PlaylistsService, private sliderController: SliderAdapter) { }

  ngOnInit() {
    let { observable, currentData } = this.data.getObservablePlaylist();
    for (let p of currentData) {
      this.playlists.push(p);
      this.playlistsF.push(Playlist.toViewFormat(p));
    }
    observable.subscribe(event => {
      //console.log('playtech playlist change detected:', event);
      switch (event.action) {
        case "flush":
          this.playlists.splice(0, this.playlists.length);
          this.playlistsF.splice(0, this.playlists.length);
          break;
        case "push":
          this.playlists.push(event.data);
          this.playlistsF.push(Playlist.toViewFormat(event.data));
          break;
        case "delete":
          this.playlists.splice(event.data, 1);
          this.playlistsF.splice(event.data, 1);
          break;
        case "update":
          let index = Playlist.indexById(this.playlists, event.data.id)
          if (index != -1) {
            this.playlists[index] = event.data;
            this.playlistsF[index] = Playlist.toViewFormat(event.data);
          }
          break;
        case "swap":
          moveItemInArray(this.playlists, event.data.oldIndex, event.data.newIndex);
          moveItemInArray(this.playlistsF, event.data.oldIndex, event.data.newIndex);
          break;
        default:
          break;
      }
    });
  }

  addPlaylist() {
    this.selectedPlaylistId = null;
    this.sliderPlaylistCreation = true;
    this.slider.setBarTitle('Nouvelle playlist');
    this.sliderController.showSlider();
  }

  editPlaylist(index) {
    this.selectedPlaylistId = this.playlists[index].id;
    this.sliderPlaylistCreation = false;
    this.slider.setBarTitle('Edition playlist');
    this.sliderController.showSlider();
  }

  movePlaylist(event) {
    if (event.oldIndex != event.newIndex) {
      this.data.reorderPlaylistList(event.oldIndex, event.newIndex);
    }
  }

  delPlaylist(index) {
    this.data.removePlaylist(index);
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
