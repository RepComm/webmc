import { Exponent } from "../exponent.js";
export class Drawing extends Exponent {
  //@ts-ignore
  constructor(ctxConfig) {
    super();
    this.renderPasses = new Array();
    this.autoClear = true;
    this.autoResize = false;
    this.needsRedraw = true;
    /**TODO - This should probably be Canvas pixel ratio?*/

    this.pixelRatio = 1;
    this.make("canvas");
    this.addClasses("exponent-drawing");
    this.context = this.element.getContext("2d", ctxConfig);

    this.frameCallback = delta => {
      if (this.getEnabled()) {
        if (this.needsRedraw) {
          this.render();
        }

        requestAnimationFrame(this.frameCallback);
      }
    };

    requestAnimationFrame(this.frameCallback);

    this.onResize = () => {
      if (this.autoResize) {
        this.setSize(Math.floor(this.rect.width * this.pixelRatio), Math.floor(this.rect.height * this.pixelRatio));
      }
    };

    window.addEventListener("resize", this.onResize);
  }

  setNeedsRedraw(redraw = true) {
    this.needsRedraw = redraw;
    return this;
  }

  hasRenderPass(cb) {
    return this.renderPasses.includes(cb); // return this.renderPasses.indexOf(cb) != -1;
  }

  removeRenderPass(cb) {
    if (!this.hasRenderPass(cb)) throw "Cannot remove render pass, not in list";
    let ind = this.renderPasses.indexOf(cb);
    this.renderPasses.splice(ind, 1);
    return this;
  }

  addRenderPass(cb) {
    if (this.hasRenderPass(cb)) throw "Cannot add render pass more than once";
    this.renderPasses.push(cb);
    return this;
  }

  get width() {
    return this.element.width;
  }

  set width(v) {
    this.element.width = v;
  }

  get height() {
    return this.element.height;
  }

  set height(v) {
    this.element.height = v;
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
    this.needsRedraw = true;
    return this;
  }

  render() {
    this.needsRedraw = false;

    if (this.autoClear) {
      this.context.clearRect(0, 0, this.width, this.height);
    }

    for (let cb of this.renderPasses) {
      cb(this.context, this);
    }
  }

  setHandlesResize(autoResize) {
    this.autoResize = autoResize;
    setTimeout(() => {
      this.onResize(undefined);
    }, 100);
    return this;
  }

}