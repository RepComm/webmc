import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
import { Chunk } from "./chunk.js";
import { WorldComponent } from "./worldcomponent.js";
import { RigidBody } from "./rigidbody.js";
import { Globals } from "../utils/global.js";
import { Block } from "../voxel/block.js";
export function flooredVec3same(a, b) {
  return Math.floor(a.x) === Math.floor(b.x) && Math.floor(a.y) === Math.floor(b.y) && Math.floor(a.z) === Math.floor(b.z);
}
export function floorVec3(v) {
  v.x = Math.floor(v.x);
  v.y = Math.floor(v.y);
  v.z = Math.floor(v.z);
}
/**
 * Specialized collider component that generates
 * cuboid colliders on the fly in spaces that require them
 */

export class ChunkCollider extends WorldComponent {
  constructor() {
    super();
    this.trackers = new Set();
    this.colliders = new Map();
    this.unusedColliders = new Set();
    this.generatorVec = new Vec3();
    this.genOffset = new Vec3();
    this.generatorBlock = new Block();

    this.onUpdate = () => {
      for (let t of this.trackers) {
        //fix potential fuck ups
        if (t.lastCenter === undefined || t.lastCenter === t.center) t.lastCenter = new Vec3(); //see if block coord was changed

        if (!flooredVec3same(t.center, t.lastCenter)) {
          console.log("Block position changed", t.center); //update for next time

          t.lastCenter.copy(t.center);
          let hw = 2; //perform block collider generation if required

          for (let x = -hw; x < hw + 1; x++) {
            for (let y = -hw; y < hw + 1; y++) {
              for (let z = -hw; z < hw + 1; z++) {
                this.genOffset.set(x, y, z);
                this.gen(t, this.genOffset);
              }
            }
          }
        }
      }
    };
  }

  gen(t, offset) {
    this.generatorVec.copy(t.center);
    this.generatorVec.add(offset);
    floorVec3(this.generatorVec); // this.generatorVec.y--; //search underneath (TODO expand to search area later)

    if (!Chunk.isPositionBounded(this.generatorVec.x, this.generatorVec.y, this.generatorVec.z)) return;
    this.chunk.getBlockData(this.generatorBlock, this.generatorVec.x, this.generatorVec.y, this.generatorVec.z);
    if (this.generatorBlock.type === 0) return;
    let idx = this.resolveStringVec3(t.center);
    let col = this.colliders.get(idx); //if no collision here, create one

    if (!col) {
      console.log("generating collider", this.generatorVec);
      col = this.getCollider();
      this.setColliderActive(col, true, idx, this.generatorVec);
    }
  }

  resolveStringVec3(v) {
    return `${Math.floor(v.x)},${Math.floor(v.y)},${Math.floor(v.z)}`;
  }

  getCollider() {
    let result;

    for (let r of this.unusedColliders) {
      result = r;
      break;
    }

    if (!result) {
      let desc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
      if (!this.rb) this.rb = this.getComponent(RigidBody);

      if (this.rb) {
        result = Globals._rapierWorld.createCollider(desc, this.rb._rapierRigidBody);
      } else {
        console.log("no rb detected?");
      }
    }

    return result;
  }

  setColliderActive(c, active = true, idx, v) {
    if (active) {
      this.unusedColliders.delete(c);
      this.colliders.set(idx, c); //cuboids are centered, unoffset them!
      // v.x -=0.5;
      // v.y -=0.5;
      // v.z -=0.5;

      c.setTranslationWrtParent({
        x: v.x + 1,
        y: v.y + 1,
        z: v.z + 1
      });
    } else {
      //TODO - clear them from map this.colliders
      this.unusedColliders.add(c);
    }

    return this;
  }

  onAttach() {
    this.chunk = this.getComponent(Chunk);
    this.rb = this.getComponent(RigidBody);
  }

  startTrack(t) {
    this.trackers.add(t);
    return this;
  }

  stopTrack(t) {
    this.trackers.delete(t);
    return this;
  }

}