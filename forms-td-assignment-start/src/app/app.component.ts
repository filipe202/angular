import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscriptions  = ['Basic', 'Advanced', 'Pro'];
  defaultSubscription = 'Advanced';
  @ViewChild('f') form:  NgForm;

  onSubmit() {
    console.log(this.form);

  }
}