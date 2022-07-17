import { on } from "../aliases.js";
import { roundToNext, clamp, lerp, inverseLerp, ndist } from "../math/general.js"; // import { Panel, SquarePanel } from "../mod.js";

import { Panel } from "./panel.js";
import { SquarePanel } from "./squarepanel.js"; //TODO - This needs to go

const knobImages = ["./images/knob01.svg", "./images/knob02.svg", "./images/knob03.svg", "./images/knob04.svg", "./images/knob05.svg", "./images/knob06.svg", "./images/knob07.svg"];
export class Knob extends SquarePanel {
  constructor() {
    super();
    this.min = 0;
    this.max = 1;
    this.minTurns = -0.5;
    this.maxTurns = 1.5;
    this.value = 0;
    this.prevalue = 0;
    this.turning = false;
    this.turningx = 0;
    this.turningy = 0;
    this.step = 0;
    this.addClasses("exponent-knob");
    this.grab = new Panel().addClasses("exponent-knob-grab").mount(this.container);
    let ind = Math.floor(Math.random() * knobImages.length);
    this.setImage(knobImages[ind]);
    this.grab.on("mousedown", evt => {
      evt.preventDefault();
      this.turning = true;
      this.turningx = evt.screenX;
      this.turningy = evt.screenY;
    });
    on(window, "mouseup", evt => {
      this.turning = false;
    });
    on(window, "mousemove", evt => {
      if (this.turning) {
        let delta = evt.movementX - evt.movementY;
        delta *= Knob.sensitivity / ndist(this.min, this.max);
        if (evt.ctrlKey) delta /= 4;
        this.addValue(delta); // let value = dist(
        //   this.turningx,
        //   this.turningy,
        //   evt.screenX,
        //   evt.screenY
        // ) * ndist(this.min, this.max) * Knob.sensitivity;
        // this.setValue(value);
      }
    });
    this.setValue(0);
  }

  addValue(a) {
    this.setValue(this.prevalue + a);
    return this;
  }

  setValue(v) {
    /**value is defined as a number between min and max
     * -- it can be over, which is fine,
     * -- but we clamp it so it won't do that for experience purposes
     * 
     * Next we calculate the amount of turn (from straight up)
     * and we do that be finding the interpolant of value between min and max
     * and lerping with minTurn maxTurn using interpolant
     * 
     * This ensures the same ratio of value to min -> max
     * as turn to minTurn -> maxTurn
     */
    //Clamp the input
    this.prevalue = clamp(v, this.min, this.max);
    this.value = this.prevalue;

    if (this.step != 0) {
      this.value = roundToNext(this.value, this.step);
    } //Calculate turns


    let turns = lerp(this.minTurns, this.maxTurns, inverseLerp(this.min, this.max, this.value));
    this.grab.setStyleItem("transform", [`rotate(${turns}turn)`]);
    return this;
  }

  getValue() {
    return this.value;
  }

  setImage(url) {
    this.grab.setStyleItem("background-image", `url('${url}')`);
    return this;
  }

}
Knob.sensitivity = 0.005;