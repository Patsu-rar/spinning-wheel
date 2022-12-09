import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SpinnerComponent, TextAlignment, TextOrientation} from "./spinner/spinner.component";
import {Spinner, SpinnerService} from "./spinner.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  constructor(private spinnerService: SpinnerService, private router: Router) {
  }

  @ViewChild(SpinnerComponent, { static: false }) theWheel: any;

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isMobileView: boolean = window.innerWidth <= 576;
  subscribers: Subscription[] = [];
  spinningID: number = 0;
  idToLandOn: any;
  items!: Observable<Spinner>;
  textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
  textAlignment: TextAlignment = TextAlignment.OUTER;
  wheelWidth: number = this.isMobileView ? 500 : 250;
  wheelHeight: number = this.isMobileView ? 500 : 250;

  ngOnInit(){
    this.router.navigate(['/1']);
    setTimeout(() => {
      this.spinningID = +this.router.url.slice(1,2);
    },0);

    this.items = this.spinnerService.getAllData();
  }

  before() {
    alert('Your wheel is about to spin');
  }

  async spin(prize: any) {
    this.idToLandOn = prize;
    await new Promise(resolve => setTimeout(resolve, 0));
    this.theWheel.spin();
  }

  after() {
    alert('Congratulations!!!');
  }

  onSubmit() {
    this.spinnerService.getWinningId(this.form.value.firstName, this.form.value.email, this.spinningID)
      .subscribe(res => {
        let winner = res.filter((el: any) => el.spinningID === this.spinningID)[0].winSectionID;
        this.spin(winner);
      });
  }

  ngOnDestroy() {
    this.subscribers.forEach(el => el.unsubscribe());
  }
}
