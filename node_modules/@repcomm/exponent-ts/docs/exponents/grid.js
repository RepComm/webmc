import { Panel } from "./panel.js";
export class Grid extends Panel {
  constructor() {
    super();
    this.columns = 3;
    this.rows = 3;
    this.addClasses("exponent-grid");
  }

  setColumnCount(columns) {
    this.columns = columns;
    this.setStyleItem("grid-template-columns", `repeat(${columns}, 1fr)`);
    return this;
  }

  getColumnCount() {
    return this.columns;
  }

  setRowCount(rows) {
    this.rows = rows;
    this.setStyleItem("grid-template-rows", `repeat(${rows}, 1fr)`);
    return this;
  }

  getRowCount() {
    return this.rows;
  }

  setCell(e, columnStart, rowStart, columnEnd, rowEnd) {
    e.setStyleItem("grid-column-start", columnStart);
    e.setStyleItem("grid-row-start", rowStart);
    if (columnEnd) e.setStyleItem("grid-column-end", columnEnd);
    if (rowEnd) e.setStyleItem("grid-row-end", rowEnd);
    e.mount(this);
    return this;
  }

  setGap(gapStyle) {
    this.setStyleItem("gap", gapStyle);
    return this;
  }

}