import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {
  @Input() passwordExist = false;
  editing = false;

  constructor(private notify: NotificationService) { }

  ngOnInit() {
  }

  startPasswordEdition() {
    this.editing = true;
  }

  changePassword() {
    console.log('submit form');
    this.notify.info('Password has been changed!');
    this.editing = false;
    this.passwordExist = true;
  }
}
