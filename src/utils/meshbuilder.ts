import type { Vec2, Vec3 } from "ogl-typescript";

export interface MeshBuilderBuildResult {
  vs: Float32Array;
  uvs: Float32Array;
  ns: Float32Array;
}

export interface MeshBuilderCubeSides {
  /** should top quad be created (+Y)*/
  top_Y?: boolean;
  /** should bottom quad be created (-Y)*/
  bottom_YN?: boolean;

  /** should left quad be created (-X)*/
  left_XN?: boolean;
  /** should right quad be created (+X)*/
  right_X?: boolean;

  /** should back quad be created (-Z)*/
  back_ZN?: boolean;
  /** should front quad be created (+Z)*/
  front_Z?: boolean;
}
export const MeshBuilderCubeSidesALL: MeshBuilderCubeSides = {
  /** should top quad be created (+Y)*/
  top_Y: true,
  /** should bottom quad be created (-Y)*/
  bottom_YN: true,

  /** should left quad be created (-X)*/
  left_XN: true,
  /** should right quad be created (+X)*/
  right_X: true,

  /** should back quad be created (-Z)*/
  back_ZN: true,
  /** should front quad be created (+Z)*/
  front_Z: true,
};

export class MeshBuilder {
  private vs: Array<number>;
  private uvs: Array<number>;
  private ns: Array<number>;

  constructor() {
    this.vs = new Array();
    this.uvs = new Array();
    this.ns = new Array();
  }
  clear(): this {
    this.vs.length = 0;
    this.uvs.length = 0;
    return this;
  }
  point(
    x: number, y: number, z: number = 0,
    u: number = x, v: number = y,
    nx: number = 0, ny: number = 0, nz: number = 0
  ): this {
    this.vs.push(x, y, z);
    this.uvs.push(u, v);
    this.ns.push(nx, ny, nz);
    return this;
  }
  oop_point (pos: Vec3, uv?: Vec2, normal?: Vec3): this {
    this.point(pos.x, pos.y, pos.z, uv.x, uv.y, normal.x, normal.y, normal.z);
    return this;
  }
  validate(): this {
    if (this.vs.length % 3 != 0) throw `MeshBuilder verticies not a multiple of 3! Vertex indicie count: ${this.vs.length}`;
    if (this.uvs.length % 2 != 0) throw `MeshBuilder uvs not a multiple of 2! UV indicie count: ${this.uvs.length}`;

    return this;
  }
  tri(
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
    au?: number, av?: number,
    bu?: number, bv?: number,
    cu?: number, cv?: number,
    nax?: number, nay?: number, naz?: number,
    nbx?: number, nby?: number, nbz?: number,
    ncx?: number, ncy?: number, ncz?: number
  ) {
    this.vs.push(
      ax, ay, az,
      bx, by, bz,
      cx, cy, cz
    );

    this.uvs.push(
      au || 0, av || 0,
      bu || 1, bv || 0,
      cu || 0, cv || 1
    );

    this.ns.push(
      nax||0, nay||0, naz||0,
      nbx||0, nby||0, nbz||0,
      ncx||0, ncy||0, ncz||0,
    );
  }
  oop_tri (
    a: Vec3, b: Vec3, c: Vec3,
    auv?: Vec2, buv?: Vec2, cuv?: Vec2,
    an?: Vec3, bn?: Vec3, cn?: Vec3
  ) {
    this.tri(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      c.x, c.y, c.z,
      auv.x, auv.y,
      buv.x, buv.y,
      cuv.x, cuv.y,
      an.x, an.y, an.z,
      bn.x, bn.y, bn.z,
      cn.x, cn.y, cn.z
    );
    return this;
  }
  /**
   * 0,0    1,0
   *   a----b
   *   |  / |
   *   | /  |
   *   c----d
   * 0,1    1,1
   */
  quad(
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
    dx: number, dy: number, dz: number,

    au?: number, av?: number,
    bu?: number, bv?: number,
    cu?: number, cv?: number,
    du?: number, dv?: number,

    nax?:number, nay?: number, naz?: number,
    nbx?: number, nby?: number, nbz?: number,
    ncx?: number, ncy?: number, ncz?: number,
    ndx?: number, ndy?: number, ndz?: number
  ) {
    this.tri(
      ax, ay, az,
      bx, by, bz,
      cx, cy, cz,

      au || 0, av || 0,
      bu || 1, bv || 0,
      cu || 1, cv || 0,

      nax, nay, naz,
      nbx, nby, nbz,
      ncx, ncy, ncz
    );
    this.tri(
      bx, by, bz,
      dx, dy, dz,
      cx, cy, cz,

      bu || 1, bv || 0,
      du || 1, dv || 1,
      cu || 1, cv || 0,

      nbx, nby, nbz,
      ndx, ndy, ndz,
      ncx, ncy, ncz

    );
  }
  oop_quad (
    a: Vec3, b: Vec3, c: Vec3, d: Vec3,
    auv?: Vec2, buv?: Vec2, cuv?: Vec2, duv?: Vec2,
    an?: Vec3, bn?: Vec3, cn?: Vec3, dn?: Vec3
  ) {
    this.quad(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      c.x, c.y, c.z,
      d.x, d.y, d.z,
      auv.x, auv.y,
      buv.x, buv.y,
      cuv.x, cuv.y,
      duv.x, duv.y,
      an.x, an.y, an.z,
      bn.x, bn.y, bn.z,
      cn.x, cn.y, cn.z,
      dn.x, dn.y, dn.z
    );
  }
  cube(
    minx: number, miny: number, minz: number,
    w: number, h: number, d: number,
    sides: MeshBuilderCubeSides = MeshBuilderCubeSidesALL
  ): this {

    let maxx = minx + w;
    let maxy = miny + h;
    let maxz = minz + d;

    if (sides.top_Y) {
      //top (+Y) (use maxy)
      this.quad(
        minx, maxy, minz, //a
        minx, maxy, maxz, //c
        maxx, maxy, minz, //b
        maxx, maxy, maxz  //d
      );
    }

    if (sides.bottom_YN) {
      //bottom (-Y) (swap c and b to flip face, use min y)
      this.quad(
        minx, miny, minz, //a
        maxx, miny, minz, //b
        minx, miny, maxz, //c
        maxx, miny, maxz  //d
      );
    }

    if (sides.front_Z) {
      //front (+Z) (use maxz)
      this.quad(
        minx, miny, maxz, //a
        maxx, miny, maxz, //b
        minx, maxy, maxz, //c
        maxx, maxy, maxz  //d
      );
    }

    if (sides.back_ZN) {
      //back (-Z) (swap c and b to flip face, use min z)
      this.quad(
        minx, miny, minz, //a
        minx, maxy, minz, //c
        maxx, miny, minz, //b
        maxx, maxy, minz  //d
      );
    }

    if (sides.left_XN) {
      //left (-X) (use minx)
      this.quad(
        minx, miny, minz, //a
        minx, miny, maxz, //c
        minx, maxy, minz, //b
        minx, maxy, maxz  //d
      );
    }

    if (sides.right_X) {
      //right (+X) (swap c and b to flip face, use maxx)
      this.quad(
        maxx, miny, minz, //a
        maxx, maxy, minz, //b
        maxx, miny, maxz, //c
        maxx, maxy, maxz  //d
      );
    }

    return this;
  }
  build(): MeshBuilderBuildResult {
    this.validate();

    return {
      vs: new Float32Array(this.vs),
      uvs: new Float32Array(this.uvs),
      ns: new Float32Array(this.ns)
    };
  }
}
