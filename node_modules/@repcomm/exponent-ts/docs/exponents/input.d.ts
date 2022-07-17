import { Exponent } from "../exponent.js";
export declare type InputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";
export declare class Input extends Exponent {
    element: HTMLInputElement;
    constructor();
    setValue(v: string): this;
    getValue(): string;
    setType(type: InputType): this;
    getType(): InputType;
}
