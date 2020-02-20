import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate
} from "@angular/animations";
import { ViewItem } from "~types/index";
import { MatMenuTrigger } from "@angular/material";

interface MenuAction {
  title: string;
  onActionClicked: Function;
}

@Component({
  selector: "app-cardview",
  templateUrl: "./cardview.component.html",
  styleUrls: ["./cardview.component.scss"],
  animations: [
    trigger("slide", [
      transition(":enter", [
        query(
          ".list-item",
          [
            style({ opacity: 0, transform: "translateX(-100px)" }),
            stagger(30, [
              animate(
                "0.2s cubic-bezier(0.35, 0, 0.25, 1)",
                style({ opacity: 1, transform: "none" })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class CardviewComponent implements OnInit {
  @Input() items: ViewItem[] = [];
  @Input() editMode = true;
  @Input() menuActions: MenuAction[] = [];
  // @Input() emptyMsg = 'no item is present'

  @Output() clickedItem: EventEmitter<any> = new EventEmitter();
  @Output() deletedItem: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatMenuTrigger, { static: true }) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: "0px", y: "0px" };

  constructor() {}

  ngOnInit() {}

  clickItem(index: number) {
    this.clickedItem.emit(index);
  }

  deleteItem(index: number) {
    this.deletedItem.emit(index);
  }

  onContextMenu(event: MouseEvent, item: ViewItem, index: number) {
    if (this.menuActions.length > 0) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + "px";
      this.contextMenuPosition.y = event.clientY + "px";
      this.contextMenu.menuData = { item: item, index: index };
      this.contextMenu.menu.focusFirstItem("mouse");
      this.contextMenu.openMenu();
    }
  }

  onActionClicked(func: Function, index) {
    func(index);
  }
}
