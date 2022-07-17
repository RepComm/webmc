import { Exponent } from "../exponent.js";
/**Simple class that wraps HTMLStyleElement*/

export class Style extends Exponent {
  //@ts-ignore
  constructor() {
    super();
    this.make("style"); // this.addClasses("exponent-style") //not required because this is invisible
  }

}