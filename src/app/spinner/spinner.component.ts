import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {Spinner} from "../spinner.service";
export interface Item {
  text: string,
  fillStyle: string,
  id: any,
}
export enum TextAlignment {
  INNER = 'inner',
  OUTER = 'outer',
  CENTER = 'center',
}
export enum TextOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  CURVED = 'curved',
}

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnChanges, OnDestroy {
  @Input() spinningID!: number;
  @Input() height!: number;
  @Input() idToLandOn: any;
  @Input() width!: number;
  @Input() items!: Spinner | null;
  @Input() spinDuration!: number;
  @Input() spinAmount!: number;
  @Input() innerRadius!: number;
  @Input() pointerStrokeColor!: string;
  @Input() pointerFillColor!: string;
  @Input() disableSpinOnClick!: boolean;
  @Input() textOrientation!: TextOrientation
  @Input() textAlignment!: TextAlignment

  @Output() onSpinStart: EventEmitter<any> = new EventEmitter();
  @Output() onSpinComplete: EventEmitter<any> = new EventEmitter();

  theWheel: any;
  completedSpin: boolean = false;
  isSpinning: boolean = false;

  constructor() {
  }

  ngOnChanges(changes: any) {
    if (changes.items && changes.items.currentValue) {
      this.items = changes.items.currentValue;
      let segments: any = this.items?.spinnings[this.spinningID - 1].sections;
      segments?.map((el: any) => {
        el.textFillStyle = el.fillStyle === "#ffffff" ? "#000000" : "#ffffff";
        el.textFontSize = 16;
        el.strokeStyle = el.fillStyle;
      });

      console.log(segments);
      // @ts-ignore
      this.theWheel = new Winwheel({
        numSegments: segments?.length,
        segments,// Specify number of segments.
        outerRadius: 200,  // Set radius to so wheel fits the background.
        innerRadius: 70,  // Set inner radius to make wheel hollow.
        textMargin: 0,    // Take out default margin.
        animation :           // Define spin to stop animation.
          {
            type: 'spinToStop',
            duration: this.spinDuration,
            spins: this.spinDuration
          }
      });

      this.drawTriangle();

      // @ts-ignore
      TweenMax.ticker.addEventListener("tick", this.drawTriangle.bind(this));
    }
  }

  async spin() {
    if (this.completedSpin || this.isSpinning) return;
    this.idToLandOn = this.items?.winners.filter(el => el.spinningID === this.spinningID)[0].winSectionID;
    console.log(this.idToLandOn);
    this.isSpinning = true;
    this.onSpinStart.emit(null);
    const segmentToLandOn = this.theWheel.segments.filter((x:any) => !!x).find((el: any) => this.idToLandOn === el.id);
    const segmentTheta = segmentToLandOn.endAngle - segmentToLandOn.startAngle;
    this.theWheel.animation.stopAngle = segmentToLandOn.endAngle - (segmentTheta / 4);
    this.theWheel.startAnimation();
    setTimeout(() => {
      this.completedSpin = true
      this.onSpinComplete.emit(null)
    }, this.spinDuration * 1000);
  }

  drawTriangle() {
    let ctx = this.theWheel.ctx;

    ctx.strokeStyle = '#ffe411';
    ctx.fillStyle= '#ffe411';
    ctx.lineWidth = 2;
    ctx.beginPath(); // Begin path.
    ctx.moveTo(220, 20); // Move to initial position.
    ctx.lineTo(280, 20); // Draw lines to make the shape.
    ctx.lineTo(250, 70);
    ctx.lineTo(221, 20);
    ctx.stroke();
    ctx.fill();
  }

  ngOnDestroy() {
    // @ts-ignore
    TweenMax.ticker.removeEventListener("tick")
  }
}
