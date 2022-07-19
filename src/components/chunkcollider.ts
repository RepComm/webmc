
import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
import { Chunk } from "./chunk.js";
import { WorldComponent } from "./worldcomponent.js";
import { RigidBody } from "./rigidbody.js";
import { Globals } from "../utils/global.js";
import { Block } from "../voxel/block.js";

export interface Tracker {
  center: Vec3;
  lastCenter?: Vec3;

}
export function flooredVec3same(a: Vec3, b: Vec3): boolean {
  return (
    Math.floor(a.x) === Math.floor(b.x) &&
    Math.floor(a.y) === Math.floor(b.y) &&
    Math.floor(a.z) === Math.floor(b.z)
  );
}
export function floorVec3(v: Vec3) {
  v.x = Math.floor(v.x);
  v.y = Math.floor(v.y);
  v.z = Math.floor(v.z);
}

/**
 * Specialized collider component that generates
 * cuboid colliders on the fly in spaces that require them
 */
export class ChunkCollider extends WorldComponent {
  chunk: Chunk;
  rb: RigidBody;

  trackers: Set<Tracker>;
  colliders: Map<string, RAPIER.Collider>;
  unusedColliders: Set<RAPIER.Collider>;
  generatorVec: Vec3;
  genOffset: Vec3;
  generatorBlock: Block;

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
        if (t.lastCenter === undefined || t.lastCenter === t.center) t.lastCenter = new Vec3();

        //see if block coord was changed
        if (!flooredVec3same(t.center, t.lastCenter)) {
          console.log("Block position changed", t.center);
          //update for next time
          t.lastCenter.copy(t.center);

          //perform block collider generation if required
          for (let x=-1; x<2; x++) {
            for (let y=-1; y<2; y++) {
              for (let z=-1; z<2; z++) {
                this.genOffset.set(x, y, z);
                this.gen(t, this.genOffset);
              }
            }
          }

        }
      }
    };
  }
  gen (t: Tracker, offset: Vec3) {
    this.generatorVec.copy(t.center);
    floorVec3(this.generatorVec);

    this.generatorVec.add(offset);

    this.generatorVec.y--; //search underneath (TODO expand to search area later)
    if (!Chunk.isPositionBounded(
      this.generatorVec.x,
      this.generatorVec.y,
      this.generatorVec.z
    )) return;

    this.chunk.getBlockData(
      this.generatorBlock,
      this.generatorVec.x,
      this.generatorVec.y,
      this.generatorVec.z
    );
    if (this.generatorBlock.type === 0) return;

    let idx = this.resolveStringVec3(t.center);

    let col = this.colliders.get(idx);
    //if no collision here, create one
    if (!col) {
      console.log("generating collider", this.generatorVec);
      col = this.getCollider();
      this.setColliderActive(col, true, idx, this.generatorVec);
    }
  }
  resolveStringVec3(v: Vec3): string {
    return `${Math.floor(v.x)},${Math.floor(v.y)},${Math.floor(v.z)}`;
  }
  getCollider(): RAPIER.Collider {
    let result: RAPIER.Collider;
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
  setColliderActive(c: RAPIER.Collider, active: boolean = true, idx?: string, v?: Vec3): this {
    if (active) {
      this.unusedColliders.delete(c);
      this.colliders.set(idx, c);
      //cuboids are centered, unoffset them!
      v.x -=0.5;
      v.y -=0.5;
      v.z -=0.5;

      c.setTranslationWrtParent(v);
    } else {
      //TODO - clear them from map this.colliders
      this.unusedColliders.add(c);
    }

    return this;
  }

  onAttach(): void {
    this.chunk = this.getComponent(Chunk);
    this.rb = this.getComponent(RigidBody);
  }

  startTrack(t: Tracker): this {
    this.trackers.add(t);
    return this;
  }
  stopTrack(t: Tracker): this {
    this.trackers.delete(t);
    return this;
  }
}
