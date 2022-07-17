import { Exponent } from "../exponent.js";
export interface DrawingCallback {
    (ctx: CanvasRenderingContext2D, drawing: Drawing): void;
}
export declare class Drawing extends Exponent {
    context: CanvasRenderingContext2D;
    renderPasses: Array<DrawingCallback>;
    autoClear: boolean;
    autoResize: boolean;
    element: HTMLCanvasElement;
    needsRedraw: boolean;
    frameCallback: FrameRequestCallback;
    onResize: EventListener;
    pixelRatio: number;
    constructor(ctxConfig?: CanvasRenderingContext2DSettings);
    setNeedsRedraw(redraw?: boolean): this;
    hasRenderPass(cb: DrawingCallback): boolean;
    removeRenderPass(cb: DrawingCallback): this;
    addRenderPass(cb: DrawingCallback): this;
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    setSize(w: number, h: number): this;
    private render;
    setHandlesResize(autoResize: boolean): this;
}
