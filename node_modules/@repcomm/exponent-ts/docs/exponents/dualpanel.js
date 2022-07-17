import { Panel } from "./panel.js";
export class DualPanel extends Panel {
  constructor() {
    super();
    this.direction = "row";
    this.firstRatio = 1;
    this.secondRatio = 1;
    this.addClasses("exponent-dual-panel");
  }

  onRatioUpdate() {
    if (this.first) this.first.setStyleItem("flex", this.firstRatio);
    if (this.second) this.second.setStyleItem("flex", this.secondRatio);
  }

  setRatio(first, second) {
    this.firstRatio = first;
    this.secondRatio = second;
    this.onRatioUpdate();
    return this;
  }

  setDirection(dir) {
    this.direction = dir;
    this.setStyleItem("flex-direction", dir);
    return this;
  }

  clearElements() {
    return this;
  }

  setElements(first, second) {
    if (this.first) this.first.unmount();
    if (this.second) this.second.unmount();
    this.first = first;
    this.second = second;
    first.mount(this);
    second.mount(this);
    this.onRatioUpdate();
    return this;
  }

}