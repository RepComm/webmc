import { Panel } from "./panel.js";
import { Exponent } from "../exponent.js";
export declare type ListPanelMode = "vertical" | "horizontal";
export declare class ListPanel extends Panel {
    mode: ListPanelMode;
    /**how many items fit in view*/
    itemViewRatio: number;
    constructor();
    setMode(mode: ListPanelMode): this;
    setItemViewRatio(ratio: number): this;
    hasItem(item: Exponent): boolean;
    addItem(item: Exponent): this;
}
