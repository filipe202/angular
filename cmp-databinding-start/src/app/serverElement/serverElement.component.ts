import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-serverElement',
  templateUrl: './serverElement.component.html',
  styleUrls: ['./serverElement.component.css']
})
export class ServerElementComponent implements OnInit {
  @Input('srvElement') element: { type: string; name: string; content: string };
  constructor() {}

  ngOnInit() {}
}
