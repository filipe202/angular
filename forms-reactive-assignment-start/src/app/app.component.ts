import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  status = ['Stable', 'Critical', 'Finished'];
  projectsForm: FormGroup;

  ngOnInit() {
    this.projectsForm = new FormGroup({
      project: new FormControl(
        null,
        [Validators.required],
        this.asyncforbiddenProjectNames.bind(this)
      ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      status: new FormControl('Stable')
    });
  }
  forbiddenProjectNames(control: FormControl): { [s: string]: boolean } {
    if (control.value === 'test') {
      return { projectNameIsForbidden: true };
    }
  }
  asyncforbiddenProjectNames(
    control: FormControl
  ): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test') {
          resolve({ projectNameIsForbidden: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
  onSubmit() {
    console.log(this.projectsForm);
    this.projectsForm.reset();
  }
}
