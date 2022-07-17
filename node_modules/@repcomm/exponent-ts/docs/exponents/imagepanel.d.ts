import { Panel } from "./panel.js";
export declare class ImagePanel extends Panel {
    constructor();
    setImage(url: string): this;
    setInterpolation(rule: "crisp-edges" | "optimise-quality" | "optimise-speed"): this;
    setStretchRule(rule: "fit-width" | "fit-height" | "fill-panel"): this;
}
