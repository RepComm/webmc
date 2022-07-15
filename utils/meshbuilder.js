export const MeshBuilderCubeSidesALL = {
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
  front_Z: true
};
export class MeshBuilder {
  constructor() {
    this.vs = new Array();
    this.uvs = new Array();
  }

  clear() {
    this.vs.length = 0;
    this.uvs.length = 0;
    return this;
  }

  point(x, y, z = 0, u = x, v = y) {
    this.vs.push(x, y, z);
    this.uvs.push(u, v);
    return this;
  }

  validate() {
    if (this.vs.length % 3 != 0) throw `MeshBuilder verticies not a multiple of 3! Vertex indicie count: ${this.vs.length}`;
    if (this.uvs.length % 2 != 0) throw `MeshBuilder uvs not a multiple of 2! UV indicie count: ${this.uvs.length}`;
    return this;
  }

  tri(ax, ay, az, bx, by, bz, cx, cy, cz, au, av, bu, bv, cu, cv) {
    this.vs.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    this.uvs.push(au || 0, av || 0, bu || 1, bv || 0, cu || 0, cv || 1);
  }
  /**
   * 0,0    1,0
   *   a----b
   *   |  / |
   *   | /  |
   *   c----d
   * 0,1    1,1
   */


  quad(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, au, av, bu, bv, cu, cv, du, dv) {
    this.tri(ax, ay, az, bx, by, bz, cx, cy, cz, au || 0, av || 0, bu || 1, bv || 0, cu || 1, cv || 0);
    this.tri(bx, by, bz, dx, dy, dz, cx, cy, cz, bu || 1, bv || 0, du || 1, dv || 1, cu || 1, cv || 0);
  }

  cube(minx, miny, minz, w, h, d, sides = MeshBuilderCubeSidesALL) {
    let maxx = minx + w;
    let maxy = miny + h;
    let maxz = minz + d;

    if (sides.top_Y) {
      //top (+Y) (use maxy)
      this.quad(minx, maxy, minz, //a
      minx, maxy, maxz, //c
      maxx, maxy, minz, //b
      maxx, maxy, maxz //d
      );
    }

    if (sides.bottom_YN) {
      //bottom (-Y) (swap c and b to flip face, use min y)
      this.quad(minx, miny, minz, //a
      maxx, miny, minz, //b
      minx, miny, maxz, //c
      maxx, miny, maxz //d
      );
    }

    if (sides.front_Z) {
      //front (+Z) (use maxz)
      this.quad(minx, miny, maxz, //a
      maxx, miny, maxz, //b
      minx, maxy, maxz, //c
      maxx, maxy, maxz //d
      );
    }

    if (sides.back_ZN) {
      //back (-Z) (swap c and b to flip face, use min z)
      this.quad(minx, miny, minz, //a
      minx, maxy, minz, //c
      maxx, miny, minz, //b
      maxx, maxy, minz //d
      );
    }

    if (sides.left_XN) {
      //left (-X) (use minx)
      this.quad(minx, miny, minz, //a
      minx, miny, maxz, //c
      minx, maxy, minz, //b
      minx, maxy, maxz //d
      );
    }

    if (sides.right_X) {
      //right (+X) (swap c and b to flip face, use maxx)
      this.quad(maxx, miny, minz, //a
      maxx, maxy, minz, //b
      maxx, miny, maxz, //c
      maxx, maxy, maxz //d
      );
    }

    return this;
  }

  build() {
    this.validate();
    return {
      vs: new Float32Array(this.vs),
      uvs: new Float32Array(this.uvs)
    };
  }

}