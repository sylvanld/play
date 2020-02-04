import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private auth: AuthenticationService,
    private notify: NotificationService
  ) { }

  ngOnInit() {
  }

  getErrorMessage(field: FormControl) {
    return field.hasError('required') ? 'This field is mandatory' :
      field.hasError('email') ? 'Not a valid email' :
        '';
  }

  submitLogin() {
    this.auth.login(this.email.value, this.password.value);
  }

}
