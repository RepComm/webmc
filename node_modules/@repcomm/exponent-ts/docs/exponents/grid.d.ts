import { Exponent } from "../exponent.js";
import { Panel } from "./panel.js";
export declare class Grid extends Panel {
    columns: number;
    rows: number;
    constructor();
    setColumnCount(columns: number): this;
    getColumnCount(): number;
    setRowCount(rows: number): this;
    getRowCount(): number;
    setCell(e: Exponent, columnStart: number, rowStart: number, columnEnd?: number, rowEnd?: number): this;
    setGap(gapStyle: string): this;
}
