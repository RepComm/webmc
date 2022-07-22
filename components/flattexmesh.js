import { WorldComponent } from "./worldcomponent.js";
import { MeshBuilder } from "../utils/meshbuilder.js";
import { Mesh } from "./mesh.js";
import { _2dTo1d } from "../utils/math.js";
import { Program, Texture, Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
export class FlatTexMesh extends WorldComponent {
  constructor() {
    super();
    this.size = new Vec3(1, 1, 0.2);
    this.alphaCutoff = 240;
    this.neighbor = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };
    this.current = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };
    this.sides = {
      back_ZN: true,
      bottom_YN: true,
      front_Z: true,
      left_XN: true,
      right_X: true,
      top_Y: true
    };
  }

  onAttach() {
    this.mesh = new Mesh(this.shader);
    this.entity.addComponent(this.mesh);
    this.rebuild();
  }

  rgbaIsTransparent(v) {
    return v.a < this.alphaCutoff;
  }

  rgbaPick(out, x, y) {
    if (x < 0 || x > this.imgdata.width || y < 0 || y > this.imgdata.height) {
      out.a = 0;
      return;
    }

    let idx = _2dTo1d(x, y, this.imgdata.width) * 4;
    out.r = this.imgdata.data[idx];
    out.g = this.imgdata.data[idx + 1];
    out.b = this.imgdata.data[idx + 2];
    out.a = this.imgdata.data[idx + 3];
  }

  neighbors(sides, x, y) {
    this.rgbaPick(this.neighbor, x - 1, y);
    sides.left_XN = this.rgbaIsTransparent(this.neighbor);
    this.rgbaPick(this.neighbor, x + 1, y);
    sides.right_X = this.rgbaIsTransparent(this.neighbor);
    this.rgbaPick(this.neighbor, x, y - 1);
    sides.bottom_YN = this.rgbaIsTransparent(this.neighbor);
    this.rgbaPick(this.neighbor, x, y + 1);
    sides.top_Y = this.rgbaIsTransparent(this.neighbor);
  }

  rebuild() {
    if (!this.imgdata) return;
    if (!FlatTexMesh.meshBuilder) FlatTexMesh.meshBuilder = new MeshBuilder();
    FlatTexMesh.meshBuilder.clear();
    let ix = 1 / this.imgdata.width;
    let iy = 1 / this.imgdata.height;
    let umin;
    let umax;
    let vmin;
    let vmax;

    for (let x = 0; x < this.imgdata.width; x++) {
      for (let y = 0; y < this.imgdata.height; y++) {
        this.rgbaPick(this.current, x, y);
        if (this.rgbaIsTransparent(this.current)) continue;
        this.neighbors(this.sides, x, y);
        let nx = x / this.imgdata.width;
        let ny = y / this.imgdata.height;
        umin = nx;
        umax = umin + ix;
        vmin = 1 - ny;
        vmax = vmin - iy;
        FlatTexMesh.meshBuilder.cube(nx * this.size.x, ny * this.size.y, 0, ix * this.size.x, iy * this.size.y, this.size.z, this.sides, umin, vmin, umax, vmin, umin, vmax, umax, vmax);
      }
    }

    this.mesh.updateGeometryFromMeshBuilder(Globals.gl, FlatTexMesh.meshBuilder.build());
  }

  setImage(url) {
    var _this = this;

    return new Promise(async function (_resolve, _reject) {
      if (!FlatTexMesh.canvas) FlatTexMesh.canvas = document.createElement("canvas");
      if (!FlatTexMesh.ctx) FlatTexMesh.ctx = FlatTexMesh.canvas.getContext("2d");
      let img = new Image();
      img.src = url;

      img.onload = () => {
        FlatTexMesh.canvas.width = img.width;
        FlatTexMesh.canvas.height = img.height;
        FlatTexMesh.ctx.drawImage(img, 0, 0);
        _this.imgdata = FlatTexMesh.ctx.getImageData(0, 0, img.width, img.height);
        _this.texture = new Texture(Globals.gl, {
          image: img,
          magFilter: Globals.gl.NEAREST,
          minFilter: Globals.gl.NEAREST // format: Globals.gl.RGBA,
          // premultiplyAlpha: true,

        });
        _this.shader = new Program(Globals.gl, {
          transparent: true,
          vertex: `
            attribute vec2 uv;
            attribute vec3 position;
            attribute vec3 normal;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform mat3 normalMatrix;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
              vUv = uv;
              vNormal = normalize(normalMatrix * normal);
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
          fragment: `
            precision highp float;
            uniform sampler2D tMap;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
              vec3 normal = normalize(vNormal);

              vec3 light = normalize(vec3(0.5, 1.0, -0.3));
              float shading = dot(normal, light) * 0.15;

              gl_FragColor = texture2D(tMap, vUv) + shading;
            }`,
          uniforms: {
            tMap: {
              value: _this.texture
            }
          }
        });
        if (_this.mesh) _this.rebuild();

        _resolve();
      };
    });
  }

}