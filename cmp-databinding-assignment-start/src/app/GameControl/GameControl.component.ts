import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-GameControl",
  templateUrl: "./GameControl.component.html",
  styleUrls: ["./GameControl.component.css"]
})
export class GameControlComponent implements OnInit {
  @Output() gameStarted = new EventEmitter<number>();
  gameNumber = 0;
  gameId: number;
  constructor() {}

  ngOnInit() {}
  onStartGame() {
    this.gameId = window.setInterval(() => {
      this.gameStarted.emit(this.gameNumber++);
    }, 1000);
  }
  onStopGame() {
    window.clearInterval(this.gameId);
  }
}
