
import { ImagePanel, Panel } from "@repcomm/exponent-ts";

export interface ItemDef {
  frameImageUrl: string;
}

export class ItemView extends Panel {
  img: ImagePanel;

  constructor () {
    super();
    this.addClasses("item-view");
    this.img = new ImagePanel();
  }
  setItem (item: ItemDef): this {
    this.img.setImage(item.frameImageUrl);
    return this;
  }
}

export class Hotbar extends Panel {
  items: Array<ItemView>;

  constructor () {
    super();
    this.items = new Array(9);
    for (let i=0; i<this.items.length; i++) {
      this.items[i] = new ItemView()
      .mount(this);
    }
  }
}
