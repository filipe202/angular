import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CounterService } from '../counter.service';
import { UsersService } from '../users.service';
@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent {
  @Input() users: string[];
  nActivations = 0;

  onSetToInactive(id: number) {
    this.usersService.inactivateUser(id);
  }
  constructor(private usersService:  UsersService, private counterService:  CounterService)  {
    this.nActivations = this.counterService.activations;
  }
}
