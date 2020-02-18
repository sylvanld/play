import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';

interface PasswordCheck {
  function: () => number;
  weight: number;
  hint: string;
  required: boolean;
}

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {
  @Input() passwordExist = false;
  editing = false;

  password: string = "";
  confirmation: string = "";
  hidePassword = true;
  hideConfirmation = true;


  hint: string = "";
  pwdChecks: PasswordCheck[] = [
    {
      required: true,
      hint: 'Password length must be at least 6 characters (should be > 8)',
      weight: 2,
      function: () => this.password.length > 7 ? 2 : (this.password.length > 5 ? 1 : 0)
    },
    {
      required: false,
      hint: 'Password should contains a capital letter',
      weight: 1,
      function: () => /[A-Z]/.test(this.password) ? 1 : 0
    },
    {
      required: false,
      hint: 'Password should contains a number',
      weight: 1,
      function: () => /[0-9]/.test(this.password) ? 1 : 0
    },
    {
      required: false,
      hint: 'Password should contains a special character',
      weight: 1,
      function: () => /[^A-Za-z0-9]/.test(this.password) ? 1 : 0
    }
  ];


  constructor(private notify: NotificationService) { }

  ngOnInit() {
  }

  startPasswordEdition() {
    this.editing = true;
  }

  changePassword() {
    if (this.passwordStrength < 50) {
      this.notify.error('Password is too weak! Please look at recommandations.');
    } else if (this.password != this.confirmation) {
      this.notify.error('Password and confirmation must match.');
    } else {
      this.notify.info('Password successfully set/changed!');
      this.editing = false;
      this.passwordExist = true;
    }
  }

  get passwordStrength() {
    let score = 0;
    let maxi = 0
    let result;

    this.hint = "";
    for (const check of this.pwdChecks) {
      result = check.function();
      if (result === 0) {
        this.hint = check.hint;
        if (check.required) return 0;
      };

      score += result;
      maxi += check.weight;
    }

    return 100 * score / maxi;
  }
}
