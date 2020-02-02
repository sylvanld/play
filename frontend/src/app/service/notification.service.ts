import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  snackBarSettings: MatSnackBarConfig = { duration: 2000, verticalPosition: 'top' };

  constructor(private snackBar: MatSnackBar) { }

  info(message) {
    this.snackBar.open(message, 'close', this.snackBarSettings);
  }

  error(message) {
    console.log('error' + message);
    this.snackBar.open(message, 'close', this.snackBarSettings);
  }
}
