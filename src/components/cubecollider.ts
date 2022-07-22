
import { WorldComponent } from "./worldcomponent.js";
import { RigidBody } from "./rigidbody.js";
import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";

export class CubeCollider extends WorldComponent {
  rb: RigidBody;

  private _rapierColliderDesc: RAPIER.ColliderDesc;
  _rapierCollider: RAPIER.Collider;
  private _size: Vec3;
  private _offset: Vec3;

  constructor () {
    super();
    this._size = new Vec3(1, 1, 1);
    this._offset = new Vec3();
  }
  onAttach(): void {
    this.rb = this.getComponent(RigidBody);

    this._rapierColliderDesc = RAPIER.ColliderDesc.cuboid(
      this._size.x/2, this._size.y/2, this._size.z/2
    ).setTranslation(this._offset.x, this._offset.y, this._offset.z);
    
    if (this.rb) {
      this._rapierCollider = Globals._rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
      
    }
  }
  setFriction (f: number) {
    this._rapierCollider.setFriction(f);
  }
  onReactivate(): void {
    this.rb = this.getComponent(RigidBody);

    this._rapierColliderDesc = RAPIER.ColliderDesc.cuboid(
      this._size.x, this._size.y, this._size.z
    ).setTranslation(this._offset.x, this._offset.y, this._offset.z);
    
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
