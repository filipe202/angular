import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  activations = 0;
  inactivations = 0;
  constructor() {}

  activationDone() {
    this.activations++;
    console.log('activation: ' + this.activations);
  }
  inaactivationDone() {
    this.inactivations++;
    console.log('inactivation: ' + this.inactivations);

  }
}
