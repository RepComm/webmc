import { ImagePanel, Panel } from "@repcomm/exponent-ts";
export class ItemView extends Panel {
  constructor() {
    super();
    this.addClasses("item-view");
    this.img = new ImagePanel().addClasses("item-view-img").mount(this);
  }

  setItem(item) {
    this.img.setImage(item.frameImageUrl);
    return this;
  }

}
export class Hotbar extends Panel {
  constructor() {
    super();
    this.items = new Array(9);

    for (let i = 0; i < this.items.length; i++) {
      this.items[i] = new ItemView().mount(this);
    }
  }

}