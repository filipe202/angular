import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UsersService {
userActivated  =  new Subject();
constructor() { }

}
