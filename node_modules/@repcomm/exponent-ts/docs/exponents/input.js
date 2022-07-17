import { Exponent } from "../exponent.js";
export class Input extends Exponent {
  //@ts-ignore
  constructor() {
    super();
    this.make("input");
    this.addClasses("exponent-input");
  }

  setValue(v) {
    this.element.value = v;
    return this;
  }

  getValue() {
    return this.element.value;
  }

  setType(type) {
    this.element.type = type;
    return this;
  }

  getType() {
    return this.element.type;
  }

}