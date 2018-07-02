import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  numbers: { num: number; type: string }[] = [];
  onGameStarted(number) {
    if (number % 2) {
      // it's even
      this.numbers.push({num:  number, type:  'EVEN'} );
    } else {
      // it's odd
      this.numbers.push({num:  number, type:  'ODD'} );
    }
  }
}
