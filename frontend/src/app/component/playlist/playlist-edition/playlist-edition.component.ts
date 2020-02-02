import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistsService } from '../../../view/playtech/playlists.service';
import { Playlist } from '../../../classes/Playlist';
import { Song } from '../../../classes/Song';
import { PlaylistTypeEnum } from 'src/app/classes/PlaylistType';

@Component({
  selector: 'app-playlist-edition',
  templateUrl: './playlist-edition.component.html',
  styleUrls: ['./playlist-edition.component.scss']
})
export class PlaylistEditionComponent implements OnInit {
  @Input() playlistId:string;
  @Input() locked:boolean = true;
  @Output() lockedChange: EventEmitter<any> = new EventEmitter();
  
  latOptsAVisible = [
    {
      icon: 'save',
      label: null,
      bgColor: 'blue',
      onClick: () => { this.save() }
    }
  ];
  latOpts = [
    {
      icon: 'keyboard_arrow_up',
      label: null,
      bgColor: 'red',
      onClick: () => { this.goToTop() }
    }
  ];

  lock() {
    this.locked = true;
    this.lockedChange.emit(this.locked);
  }

  unlock() {
    this.locked = false;
    this.lockedChange.emit(this.locked);
  }
  
  constructor(private data: PlaylistsService, private playlist: Playlist) { }

  ngOnInit() {
    this.playlist = new Playlist('playlist-abc', PlaylistTypeEnum.Manual, null, 'playlistMock', 'author', new Date(), []); //this.data.getPlaylist(this.playlistId);
  }


  addSong() {
    alert('add song');
    //this.playlist.songList.push(song);
  }

  moveSong(event) {
    alert('move song: '+event.oldIndex+'->'+event.newIndex);
    //moveItemInArray(this.playlist.songList, event.previousIndex, event.currentIndex);
  }

  delSong(index) {
    alert('delete song: '+index);
    //moveItemInArray(this.playlist.songList, event.previousIndex, event.currentIndex);
  }

  getSongList(): Song[] {
    return this.playlist.songList;
  }

  clear() {
    this.playlist.songList.splice(0, this.playlist.songList.length)
  }

  save() {
    alert('save playlist');
    //this.data.savePlaylist(this.playlist);
  }

  goToTop() {
    //document.body.animate({scrollTop:0}, {duration: 1000});
    window.scrollTo(0, 0);
  }
}
