import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  // styleUrls: ['./server.component.css']
  styles: [`
  .online {
    color: white;
  }
  `]
})
export class ServerComponent implements OnInit {
  serverId = 10;
  serverStatus = 'offline';
  constructor() { }

  ngOnInit() {
    this.serverStatus = Math.random()  >  0.5  ?  'online'  :  'offline';
  }

  getServerStatus()  {
    return this.serverStatus;
  }
  getColor()  {
    return this.serverStatus  ===  'online'  ? 'green'  :  'red';
  }

}
