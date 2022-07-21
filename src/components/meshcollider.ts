
import { WorldComponent } from "./worldcomponent.js";
import { RigidBody } from "./rigidbody.js";
import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";

export class MeshCollider extends WorldComponent {
  rb: RigidBody;

  private _rapierColliderDesc: RAPIER.ColliderDesc;
  private _rapierCollider: RAPIER.Collider;
  private _offset: Vec3;

  vertices: Float32Array;
  indices: Uint32Array;

  constructor () {
    super();
    this._offset = new Vec3();
  }
  setTrimesh (vs: Float32Array, inds: Uint32Array): this {
    this.vertices = vs;
    this.indices = inds;

    this.tryRecalc();
    return this;
  }
  onAttach(): void {
    this.rb = this.getComponent(RigidBody);
    this.tryRecalc();
  }
  tryRecalc () {
    console.log("Try recalc");
    //only recalculate if we have enough data
    if (this.vertices && this.indices && this.rb) {

      //clean up first
      this.tryCleanup();

      console.log("mesh collider rebuild mesh", this.vertices, this.indices);
      //then create new things
      this._rapierColliderDesc = RAPIER.ColliderDesc.trimesh(
        this.vertices, this.indices
      ).setTranslation(this._offset.x, this._offset.y, this._offset.z);
      
      this._rapierCollider = Globals._rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
    }
  }
  tryCleanup () {
    if (this._rapierCollider) Globals._rapierWorld.removeCollider(this._rapierCollider, false);
  }
  onReactivate(): void {
    this.rb = this.getComponent(RigidBody);
    this.tryRecalc();
  }
  onDetach(): void {
    this.tryCleanup();
  }
  onDeactivate(): void {
    this.tryCleanup();
  }
}
