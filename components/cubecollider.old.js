import { Vec3 } from "ogl-typescript";
import { CollisionCheck } from "./collider.js";
import { WorldComponent } from "./worldcomponent.js";
export class CubeCollider extends WorldComponent {
  constructor() {
    super();
    this.size = new Vec3(1, 1, 1);
    this.offset = new Vec3(0, 0, 0);
    this.centered = true;
  }

  setSize(x, y, z) {
    this.size.set(x, y, z);
    return this;
  }

  setOffset(x, y, z) {
    this.offset.set(x, y, z);
    return this;
  }

  get minx() {
    let result = this.transform.position.x + this.offset.x;
    if (this.centered) result -= this.size.x / 2;
    return result;
  }

  get miny() {
    let result = this.transform.position.y + this.offset.y;
    if (this.centered) result -= this.size.y / 2;
    return result;
  }

  get minz() {
    let result = this.transform.position.z + this.offset.z;
    if (this.centered) result -= this.size.z / 2;
    return result;
  }

  get maxx() {
    return this.transform.position.x + this.offset.x + (this.centered ? this.size.x / 2 : this.size.x);
  }

  get maxy() {
    return this.transform.position.y + this.offset.y + (this.centered ? this.size.y / 2 : this.size.y);
  }

  get maxz() {
    return this.transform.position.z + this.offset.z + (this.centered ? this.size.z / 2 : this.size.z);
  }

  collisionCheck(b, info) {
    if (b instanceof CubeCollider) {
      info.colliding = this.minx < b.maxx && this.maxx > b.minx && this.miny < b.maxy && this.maxy > b.miny && this.minz < b.maxz && this.maxz > b.minz;
    } else {
      return CollisionCheck.NO_DEFER;
    }
  }

}