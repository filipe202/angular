import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() changePage = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}


  onChangePage(page: string) {
    this.changePage.emit(page);
  }
}
