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
    this.ns = new Array();
    this.inds = new Array();
  }

  clear() {
    this.vs.length = 0;
    this.uvs.length = 0;
    this.ns.length = 0;
    this.inds.length = 0;
    return this;
  }

  point(x, y, z = 0, u = x, v = y, nx = 0, ny = 0, nz = 0) {
    this.vs.push(x, y, z);
    this.uvs.push(u, v);
    this.ns.push(nx, ny, nz);
    this.inds.push(1);
    return this;
  }

  oop_point(pos, uv, normal) {
    this.point(pos.x, pos.y, pos.z, uv === null || uv === void 0 ? void 0 : uv.x, uv === null || uv === void 0 ? void 0 : uv.y, normal === null || normal === void 0 ? void 0 : normal.x, normal === null || normal === void 0 ? void 0 : normal.y, normal === null || normal === void 0 ? void 0 : normal.z);
    return this;
  }

  validate() {
    if (this.vs.length % 3 != 0) throw `MeshBuilder verticies not a multiple of 3! Vertex indicie count: ${this.vs.length}`;
    if (this.uvs.length % 2 != 0) throw `MeshBuilder uvs not a multiple of 2! UV indicie count: ${this.uvs.length}`;
    return this;
  }

  tri(ax, ay, az, bx, by, bz, cx, cy, cz, au, av, bu, bv, cu, cv, nax, nay, naz, nbx, nby, nbz, ncx, ncy, ncz) {
    this.vs.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    this.uvs.push(au || 0, av || 0, bu || 1, bv || 0, cu || 0, cv || 1);
    this.ns.push(nax || 0, nay || 0, naz || 0, nbx || 0, nby || 0, nbz || 0, ncx || 0, ncy || 0, ncz || 0);
    let i = this.inds.length;
    this.inds.push(i, i + 1, i + 2);
  }

  oop_tri(a, b, c, auv, buv, cuv, an, bn, cn) {
    this.tri(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, auv === null || auv === void 0 ? void 0 : auv.x, auv === null || auv === void 0 ? void 0 : auv.y, buv === null || buv === void 0 ? void 0 : buv.x, buv === null || buv === void 0 ? void 0 : buv.y, cuv === null || cuv === void 0 ? void 0 : cuv.x, cuv === null || cuv === void 0 ? void 0 : cuv.y, an === null || an === void 0 ? void 0 : an.x, an === null || an === void 0 ? void 0 : an.y, an === null || an === void 0 ? void 0 : an.z, bn === null || bn === void 0 ? void 0 : bn.x, bn === null || bn === void 0 ? void 0 : bn.y, bn === null || bn === void 0 ? void 0 : bn.z, cn === null || cn === void 0 ? void 0 : cn.x, cn === null || cn === void 0 ? void 0 : cn.y, cn === null || cn === void 0 ? void 0 : cn.z);
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


  quad(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, au, av, bu, bv, cu, cv, du, dv, nax, nay, naz, nbx, nby, nbz, ncx, ncy, ncz, ndx, ndy, ndz) {
    this.tri(ax, ay, az, bx, by, bz, cx, cy, cz, au || 0, av || 0, bu || 1, bv || 0, cu || 0, cv || 1, nax, nay, naz, nbx, nby, nbz, ncx, ncy, ncz);
    this.tri(bx, by, bz, dx, dy, dz, cx, cy, cz, bu || 1, bv || 0, du || 1, dv || 1, cu || 0, cv || 1, nbx, nby, nbz, ndx, ndy, ndz, ncx, ncy, ncz);
  }

  oop_quad(a, b, c, d, auv, buv, cuv, duv, an, bn, cn, dn) {
    this.quad(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, d.x, d.y, d.z, auv === null || auv === void 0 ? void 0 : auv.x, auv === null || auv === void 0 ? void 0 : auv.y, buv === null || buv === void 0 ? void 0 : buv.x, buv === null || buv === void 0 ? void 0 : buv.y, cuv === null || cuv === void 0 ? void 0 : cuv.x, cuv === null || cuv === void 0 ? void 0 : cuv.y, duv === null || duv === void 0 ? void 0 : duv.x, duv === null || duv === void 0 ? void 0 : duv.y, an === null || an === void 0 ? void 0 : an.x, an === null || an === void 0 ? void 0 : an.y, an === null || an === void 0 ? void 0 : an.z, bn === null || bn === void 0 ? void 0 : bn.x, bn === null || bn === void 0 ? void 0 : bn.y, bn === null || bn === void 0 ? void 0 : bn.z, cn === null || cn === void 0 ? void 0 : cn.x, cn === null || cn === void 0 ? void 0 : cn.y, cn === null || cn === void 0 ? void 0 : cn.z, dn === null || dn === void 0 ? void 0 : dn.x, dn === null || dn === void 0 ? void 0 : dn.y, dn === null || dn === void 0 ? void 0 : dn.z);
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
      uvs: new Float32Array(this.uvs),
      ns: new Float32Array(this.ns),
      inds: new Uint32Array(this.inds)
    };
  }

}