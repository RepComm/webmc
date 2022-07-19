import { WorldComponent } from "./worldcomponent.js";
import { RigidBody } from "./rigidbody.js";
import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
export class CubeCollider extends WorldComponent {
  constructor() {
    super();
    this._size = new Vec3(1, 1, 1);
    this._offset = new Vec3();
  }

  onAttach() {
    this.rb = this.getComponent(RigidBody);
    this._rapierColliderDesc = RAPIER.ColliderDesc.cuboid(this._size.x, this._size.y, this._size.z).setTranslation(this._offset.x, this._offset.y, this._offset.z);

    if (this.rb) {
      this._rapierCollider = Globals._rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
    }
  }

  onReactivate() {
    this.rb = this.getComponent(RigidBody);
    this._rapierColliderDesc = RAPIER.ColliderDesc.cuboid(this._size.x, this._size.y, this._size.z).setTranslation(this._offset.x, this._offset.y, this._offset.z);

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