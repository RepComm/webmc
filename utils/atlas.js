import { Texture, Vec2 } from "ogl-typescript";
import { Globals } from "./global.js"; //const LinearMipmapLinearFilter = Globals.gl.LINEAR_MIPMAP_LINEAR;
// const NearestFilter = Globals.gl.NEAREST;

/**UV Quad from the texture atlas
 * All coordinates are in normalized 0..1 space
 */

// let textureLoader = new TextureLoader();
export class AtlasBuilder {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.usedHeight = 0;
    this.usedWidth = 0;
  }

  init(config) {
    this.config = config;
    this.clear();
  }

  uToX(u) {
    return u * this.config.width;
  }

  vToY(v) {
    return v * this.config.height;
  }

  xToU(x) {
    return x / this.config.width;
  }

  yToV(y) {
    return y / this.config.height;
  }

  addTexture(texture, type, slotid = 0) {
    let uv = this.atlas.type[type];
    if (!uv) uv = this.atlas.type[type] = {};
    let slot = uv[slotid];
    if (!slot) slot = uv[slotid] = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    };
    slot.x = this.xToU(this.usedWidth);
    slot.y = this.yToV(this.usedHeight);
    slot.w = this.xToU(this.config.faceSize.x);
    slot.h = this.yToV(this.config.faceSize.y);

    if (this.usedWidth >= this.config.width) {
      this.usedWidth = 0;
      this.usedHeight += this.config.faceSize.y;
    }

    if (this.usedHeight >= this.config.height) throw `No more room on atlas, consider using a larger atlas, or smaller faceSize`;
    this.usedWidth += this.config.faceSize.x;
    slot.src = texture;
  }

  loadTexture(url, type, slotid = 0) {
    var _this = this;

    return new Promise(async function (_resolve, _reject) {
      try {
        let img = document.createElement("img");
        img.src = url;
        document.body.appendChild(img);

        img.onload = () => {
          // console.log("image loaded from url", url, img);
          _this.addTexture(img, type, slotid);

          img.remove();

          _resolve();
        };
      } catch (ex) {
        _reject(ex);

        return;
      }
    });
  }

  clear() {
    this.atlas = {
      texture: null,
      type: {},
      faceSize: new Vec2().copy(this.config.faceSize),
      width: this.config.width,
      height: this.config.height
    };
  }

  setCanvasActivation(active) {
    if (active) {
      this.canvas.width = this.config.width;
      this.canvas.height = this.config.height;
      this.canvas.style.display = "block";
      document.body.appendChild(this.canvas);
    } else {
      this.canvas.style.display = "none";
      this.canvas.remove();
    }
  }

  render() {
    let typeid;
    let uvConfig;
    let slotid;
    let quad;
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);

    for (let typeidn in this.atlas.type) {
      typeid = parseInt(typeidn);
      uvConfig = this.atlas.type[typeid];

      for (let slotidn in uvConfig) {
        slotid = parseInt(slotidn);
        quad = uvConfig[slotid];
        if (!quad.src) throw `Cannot render texture atlas quad.src was falsey, expected CanvasImageSource`;
        this.ctx.drawImage(quad.src, this.uToX(quad.x), this.vToY(quad.y), this.uToX(quad.w), this.vToY(quad.h));
      }
    }
  }

  build() {
    var _this2 = this;

    return new Promise(async function (_resolve, _reject) {
      try {
        _this2.setCanvasActivation(true);

        _this2.render();

        let dataUrl = _this2.canvas.toDataURL();

        let image = new Image();
        image.src = dataUrl;

        image.onload = () => {
          _this2.atlas.texture = new Texture(Globals.gl, {
            image,
            magFilter: Globals.gl.NEAREST,
            minFilter: Globals.gl.NEAREST
          });

          _this2.setCanvasActivation(false);

          _resolve(_this2.atlas);
        };
      } catch (ex) {
        console.warn(ex);

        _reject(ex);

        return;
      }
    });
  }

}