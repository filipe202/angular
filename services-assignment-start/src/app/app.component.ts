import { Component } from '@angular/core';

import { CounterService } from './counter.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeUsers:  string[] = [];
  inactiveUsers:  string[] = [];

  constructor(private usersService:  UsersService, private counterService:  CounterService)  {
    this.activeUsers = this.usersService.activeUsers;
    this.inactiveUsers = this.usersService.inactiveUsers;
  }
}
