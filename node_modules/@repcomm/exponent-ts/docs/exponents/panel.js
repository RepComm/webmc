import { Exponent } from "../exponent.js";
export class Panel extends Exponent {
  constructor() {
    super();
    this.make("div");
    this.addClasses("exponent-panel");
  }

}