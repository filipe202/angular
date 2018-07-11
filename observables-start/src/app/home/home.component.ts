import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  myNumbersSubscription:  Subscription;
  myCustomSubscription:  Subscription;
  ngOnDestroy()  {
    this.myNumbersSubscription.unsubscribe();
    this.myCustomSubscription.unsubscribe();
  }
  constructor() { }

  ngOnInit() {
    const myNumbers = Observable.interval(1000)
    .map(
      (data: number)  =>  {
        return data  *  2;
      }
    )
    ;
    this.myNumbersSubscription  = myNumbers.subscribe(
      (number:  number)  =>  {
        console.log(number);
      }
    );
    const myObservable  =  Observable.create((observer:  Observer<string>)  =>  {
      setTimeout(()  =>  {
        observer.next('first package');
      }, 2000);
      setTimeout(()  =>  {
        observer.next('second package');
      }, 4000);
      setTimeout(()  =>  {
        observer.complete();
      }, 5000);
      setTimeout(()  =>  {
        observer.next('third package');
      }, 6000);
    });
    this.myCustomSubscription = myObservable.subscribe(
      (data:  string)  =>  {
        console.log(data);
      },
      (error:  string)  =>  {
        console.log(error);
      },
      ()  =>  {
        console.log('completed');
      }
    );

  }

}
