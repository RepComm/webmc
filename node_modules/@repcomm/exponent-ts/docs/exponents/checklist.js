import Component from "../component.js";
import { Panel } from "./panel.js";
export class CheckList extends Panel {
  constructor() {
    super();
    this.header = new CheckListHeader().textContent("text").mount(this);
  }

  addItem(item) {
    this.mountChild(item);
    return this;
  }

  createItem(name) {
    let item = new CheckListItem().textContent(name);
    this.addItem(item);
    return item;
  }

  getHeader() {
    return this.header;
  }

}
export class CheckListHeader extends Component {
  constructor() {
    super();
    this.make("div");
    this.text = new Component().make("span").setTextContent("text").mount(this);
  }

  textContent(text) {
    this.text.setTextContent(text);
    return this;
  }

}
export class CheckListItem extends Component {
  constructor() {
    super();
    this.make("div");
    this.checkbox = new Component().make("input").setAttr("type", "checkbox").mount(this);
    this.setChecked(true);
    this.text = new Component().make("span").setTextContent("text").mount(this);
  }

  textContent(text) {
    this.text.setTextContent(text);
    return this;
  }

  setChecked(checked) {
    this.setAttr("checked", checked);
    return this;
  }

  getChecked() {
    return this.getAttr("checked") == true;
  }

}