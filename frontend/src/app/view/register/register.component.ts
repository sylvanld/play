import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user = {
    email: '',
    password: ''
  };
  confirmation: string;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
  }

  submitRegistration() {
    if (this.user.password !== '' && this.user.password === this.confirmation) {
      this.auth.register(this.user).subscribe(resp => {
        console.log(resp);
      });
    }
  }

}
