import Component from "../component.js";
import { Panel } from "./panel.js";
export declare type SquarePanelAlignH = "left" | "right" | "center";
export declare type SquarePanelAlignV = "top" | "bottom" | "center";
/**A panel whose child is always squarely fit inside
 */
export declare class SquarePanel extends Panel {
    /**The element that is actually square*/
    container: Panel;
    onResize: EventListener;
    /**Length of side*/
    length: number;
    /**Calculated x offset of container*/
    cx: number;
    /**Calculated y offset of container*/
    cy: number;
    alignHorizontal: SquarePanelAlignH;
    alignVertical: SquarePanelAlignV;
    constructor();
    /**Recalculate size metrics from DOM rects
     * You need to applyChildSize after using this to
     * see the effects
     */
    calcChildSize(): this;
    applyChildSize(): this;
    mountChild(child: Component | HTMLElement): this;
    setAlign(hor: SquarePanelAlignH, ver: SquarePanelAlignV): this;
}
