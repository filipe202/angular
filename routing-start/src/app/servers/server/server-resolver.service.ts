import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServersService } from '../servers.service';


interface Server  {
  id: Number; name: string; status: string;
}
@Injectable({
  providedIn: 'root'
})
export class ServerResolver
  implements Resolve<Server> {
  constructor(private serversService:  ServersService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Server
    | Observable<Server>
    | Promise<Server> {
    return this.serversService.getServer(+route.params['id']);
  }
}