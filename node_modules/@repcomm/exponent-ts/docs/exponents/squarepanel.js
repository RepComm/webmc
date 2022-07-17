import { Panel } from "./panel.js";

/**A panel whose child is always squarely fit inside
 */
export class SquarePanel extends Panel {
  /**The element that is actually square*/

  /**Length of side*/

  /**Calculated x offset of container*/

  /**Calculated y offset of container*/
  constructor() {
    super();
    this.container = new Panel();
    this.length = 0;
    this.cx = 0;
    this.cy = 0;
    this.alignVertical = "center";
    this.alignHorizontal = "center";
    this.addClasses("exponent-square");

    this.onResize = () => {
      //Always recalc size
      this.calcChildSize(); //Only apply it if we're enabled

      if (this.getEnabled()) this.applyChildSize();
    };

    window.addEventListener("resize", this.onResize);
    this.container.mount(this); // this.container.styleItem("position", "absolute");

    this.container.addClasses("exponent-square-container");
  }
  /**Recalculate size metrics from DOM rects
   * You need to applyChildSize after using this to
   * see the effects
   */


  calcChildSize() {
    let min = Math.min(this.rect.width, this.rect.height);
    let max = Math.max(this.rect.width, this.rect.height);
    let gap = max - min;
    let wIsBigger = this.rect.width > this.rect.height; //Set length of square to the smaller value

    this.length = Math.floor(min); //Handle centering coords

    if (wIsBigger) {
      this.cy = 0; //Reset offset

      if (this.alignHorizontal == "center") {
        this.cx = Math.floor(gap / 2); //move over by half gap
      } else if (this.alignHorizontal == "left") {
        this.cx = 0;
      } else {
        this.cx = Math.floor(gap);
      }
    } else {
      this.cx = 0; //Reset offset

      if (this.alignVertical == "center") {
        this.cy = Math.floor(gap / 2); //move over by half gap
      } else if (this.alignVertical == "top") {
        this.cy = 0;
      } else {
        this.cy = Math.floor(gap);
      }
    } //Apparently this, and position:absolute works..
    //TODO - fix parent container offset gap


    this.cx += this.rect.x;
    this.cy += this.rect.y; //Whatever.

    return this;
  }

  applyChildSize() {
    //EW
    this.container.setStyleItem("width", `${this.length}px`);
    this.container.setStyleItem("height", `${this.length}px`);
    this.container.setStyleItem("left", `${this.cx}px`);
    this.container.setStyleItem("top", `${this.cy}px`);
    return this;
  }

  mountChild(child) {
    console.log("Square content", child);
    this.container.mountChild(child);
    setTimeout(() => {
      this.calcChildSize();
      this.applyChildSize();
    }, 100);
    return this;
  }

  setAlign(hor, ver) {
    this.alignHorizontal = hor;
    this.alignVertical = ver;
    return this;
  }

}