import { Panel } from "./panel.js";
export class ImagePanel extends Panel {
  constructor() {
    super();
    this.setStretchRule("fit-width");
  }

  setImage(url) {
    this.setStyleItem("background-image", `url('${url}')`);
    return this;
  }

  setInterpolation(rule) {
    this.setStyleItem("image-rendering", rule);
    return this;
  }

  setStretchRule(rule) {
    switch (rule) {
      case "fill-panel":
        //not implemented yet
        break;

      case "fit-width":
        this.setStyleItem("background-size", `100% auto`);
        this.setStyleItem("background-position", `50% 50%`);
        break;

      case "fit-height":
        this.setStyleItem("background-size", `auto 100%`);
        this.setStyleItem("background-position", `50% 50%`);
        break;
    }

    return this;
  }

}