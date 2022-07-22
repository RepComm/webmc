import { WorldComponent } from "./worldcomponent.js";
import { RigidBody } from "./rigidbody.js";
import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
export class SphereCollider extends WorldComponent {
  constructor(r = 0.4) {
    super();
    this._radius = r;
    this._offset = new Vec3();
  }

  setRadius(r) {
    this._radius = r;
    return this;
  }

  onAttach() {
    this.rb = this.getComponent(RigidBody);
    this._rapierColliderDesc = RAPIER.ColliderDesc.ball(this._radius).setTranslation(this._offset.x, this._offset.y, this._offset.z);

    if (this.rb) {
      this._rapierCollider = Globals._rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
    }
  }

  setFriction(f) {
    this._rapierCollider.setFriction(f);
  }

  onReactivate() {
    this.rb = this.getComponent(RigidBody);
    this._rapierColliderDesc = RAPIER.ColliderDesc.ball(this._radius).setTranslation(this._offset.x, this._offset.y, this._offset.z);

    if (this.rb) {
      this._rapierCollider = Globals._rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
    }
  }

  onDetach() {
    Globals._rapierWorld.removeCollider(this._rapierCollider, true);
  }

  onDeactivate() {
    Globals._rapierWorld.removeCollider(this._rapierCollider, true);
  }

}