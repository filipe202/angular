import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showPass = false;
  logs = [];
  toggleShowPass() {
    this.showPass = !this.showPass;
    this.logs.push('clicked and show is now ' + this.showPass);
  }
  getBackgroundColor(i) {
    if (i > 5) {
      return 'blue';
    }
  }
}
