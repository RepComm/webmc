import { Panel } from "./panel.js";
export class ListPanel extends Panel {
  /**how many items fit in view*/
  constructor() {
    super();
    this.mode = "vertical";
    this.itemViewRatio = 5;
    this.addClasses("exponent-list");
    this.setMode("vertical");
  }

  setMode(mode) {
    this.mode = mode;

    if (this.mode == "horizontal") {
      this.setStyleItem("overflow", "scroll hidden");
      this.setStyleItem("flex-direction", "row");
    } else {
      this.setStyleItem("overflow", "hidden scroll");
      this.setStyleItem("flex-direction", "column");
    }

    return this;
  }

  setItemViewRatio(ratio) {
    this.itemViewRatio = ratio;
    return this;
  }

  hasItem(item) {
    throw "Not implemented yet"; //TODO - implement
  }

  addItem(item) {
    if (this.hasItem(item)) throw "Cannot add item more than once";
    return this;
  }

}