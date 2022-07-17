import { Exponent } from "../exponent.js";
import { Panel } from "./panel.js";
export declare type DualPanelDirection = "row" | "row-reverse" | "column" | "column-reverse";
export declare class DualPanel extends Panel {
    direction: DualPanelDirection;
    firstRatio: number;
    secondRatio: number;
    first: Exponent;
    second: Exponent;
    constructor();
    onRatioUpdate(): void;
    setRatio(first: number, second: number): this;
    setDirection(dir: DualPanelDirection): this;
    clearElements(): DualPanel;
    setElements(first: Exponent, second: Exponent): this;
}
