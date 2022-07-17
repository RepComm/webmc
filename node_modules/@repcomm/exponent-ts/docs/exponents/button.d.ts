import { Exponent } from "../exponent.js";
export declare class Button extends Exponent {
    /**TODO - This should probably be abstracted*/
    useType: "normal" | "back" | "foward";
    constructor();
    setUseType(type: "normal" | "back" | "foward"): this;
}
