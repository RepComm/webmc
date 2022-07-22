
import { WorldComponent } from "./worldcomponent.js";
import { RigidBody } from "./rigidbody.js";
import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";

export class SphereCollider extends WorldComponent {
  rb: RigidBody;

  private _rapierColliderDesc: RAPIER.ColliderDesc;
  _rapierCollider: RAPIER.Collider;
  private _radius: number;
  private _offset: Vec3;

  constructor (r: number = 0.4) {
    super();
    this._radius = r;
    this._offset = new Vec3();
  }
  setRadius (r: number): this {
    this._radius = r;
    return this;
  }
  onAttach(): void {
    this.rb = this.getComponent(RigidBody);

    this._rapierColliderDesc = RAPIER.ColliderDesc
    .ball(this._radius)
    .setTranslation(this._offset.x, this._offset.y, this._offset.z);
    
    if (this.rb) {
      this._rapierCollider = Globals._rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
    }
  }
  setFriction (f: number) {
    this._rapierCollider.setFriction(f);
  }
  onReactivate(): void {
    this.rb = this.getComponent(RigidBody);

    this._rapierColliderDesc = RAPIER.ColliderDesc
    .ball(this._radius)
    .setTranslation(this._offset.x, this._offset.y, this._offset.z);
    
    if (this.rb) {
      this._rapierCollider = Globals._rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
    }
  }
  onDetach(): void {
    Globals._rapierWorld.removeCollider(this._rapierCollider, true);
  }
  onDeactivate(): void {
    Globals._rapierWorld.removeCollider(this._rapierCollider, true);
  }
}
