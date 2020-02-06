import { Component, OnInit, Input } from '@angular/core';
import { Track } from '~types/track';
import { SelectionModel } from '@angular/cdk/collections';
import { PlayerService } from '~player/player.service';

@Component({
  selector: 'app-tracks-list',
  templateUrl: './tracks-list.component.html',
  styleUrls: ['./tracks-list.component.scss']
})
export class TracksListComponent implements OnInit {
  @Input() tracks: Track[] = [];
  displayedColumns: string[] = ['select', 'title', 'artist', 'album', 'release'];
  selection = new SelectionModel<Track>(true, []);

  constructor(private player: PlayerService) { }

  ngOnInit() { }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tracks.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tracks.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(track?: Track): string {
    if (!track) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(track) ? 'deselect' : 'select'} select ${track.title + 1}`;
  }

  playSelection() {
    this.player.loadTracks(...this.selection.selected);
  }
}
