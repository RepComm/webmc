import { Exponent } from "../exponent.js";
export class Button extends Exponent {
  /**TODO - This should probably be abstracted*/
  constructor() {
    super();
    this.setUseType("normal");
    this.make("button");
    this.addClasses("exponent-dark", "exponent-button");
  }

  setUseType(type) {
    this.useType = type;
    return this;
  }

}