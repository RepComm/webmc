
import { Vec3 } from "ogl-typescript";
import { Collider, CollisionCheck, CollisionInfo } from "./collider.js";
import { WorldComponent } from "./worldcomponent.js";

export class CubeCollider extends WorldComponent {

  size: Vec3;
  offset: Vec3;
  centered: boolean;

  constructor() {
    super();

    this.size = new Vec3(1, 1, 1);
    this.offset = new Vec3(0, 0, 0);
    this.centered = true;
  }
  setSize(x: number, y: number, z: number): this {
    this.size.set(x, y, z);
    return this;
  }
  setOffset(x: number, y: number, z: number): this {
    this.offset.set(x, y, z);
    return this;
  }
  get minx (): number {
    let result = this.transform.position.x + this.offset.x;
    if (this.centered) result -= this.size.x/2;
    return result;
  }
  get miny (): number {
    let result = this.transform.position.y + this.offset.y;
    if (this.centered) result -= this.size.y/2;
    return result;
  }
  get minz (): number {
    let result = this.transform.position.z + this.offset.z;
    if (this.centered) result -= this.size.z/2;
    return result;
  }
  get maxx (): number {
    return (
      this.transform.position.x +
      this.offset.x +
      (this.centered ? this.size.x/2 : this.size.x)
    );
  }
  get maxy (): number {
    return (
      this.transform.position.y +
      this.offset.y +
      (this.centered ? this.size.y/2 : this.size.y)
    );
  }
  get maxz (): number {
    return (
      this.transform.position.z +
      this.offset.z +
      (this.centered ? this.size.z/2 : this.size.z)
    );
  }

  collisionCheck (b: Collider, info: CollisionInfo): CollisionCheck {
    if (b instanceof CubeCollider) {
      info.colliding = (
        this.minx < b.maxx &&
        this.maxx > b.minx &&
        
        this.miny < b.maxy &&
        this.maxy > b.miny &&
        
        this.minz < b.maxz &&
        this.maxz > b.minz
      );
    } else {
      return CollisionCheck.NO_DEFER;
    }
  }
}
