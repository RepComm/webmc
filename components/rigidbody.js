import { WorldComponent } from "./worldcomponent.js";
import { Globals } from "../utils/global.js";
import RAPIER from "@dimforge/rapier3d-compat";
import { Vec3 } from "ogl-typescript";
export let RigidBodyType;

(function (RigidBodyType) {
  RigidBodyType[RigidBodyType["FIXED"] = 0] = "FIXED";
  RigidBodyType[RigidBodyType["DYNAMIC"] = 1] = "DYNAMIC";
  RigidBodyType[RigidBodyType["KinematicPositionBased"] = 2] = "KinematicPositionBased";
  RigidBodyType[RigidBodyType["KinematicVelocityBased"] = 3] = "KinematicVelocityBased";
})(RigidBodyType || (RigidBodyType = {}));

export class RigidBody extends WorldComponent {
  constructor() {
    super();
    this.velocity = new Vec3();

    this.onUpdate = () => {
      let v = this._rapierRigidBody.translation();

      this.transform.position.set(v.x, v.y, v.z);
      this.linvel(this.velocity);
    };

    this.type = RigidBodyType.DYNAMIC;
  }
  /**Cannot be changed while rigidbody component is attached and enabled, set then reattach the component to see changes*/


  set type(t) {
    this._type = t;
  }

  onAttach() {
    let {
      x,
      y,
      z
    } = this.transform.position;
    console.log("RB", this.type, this.entity.label);

    switch (this._type) {
      case RigidBodyType.FIXED:
        this._rapierRigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
        console.log("Fixed rb", this.entity.label);
        break;

      case RigidBodyType.KinematicPositionBased:
        this._rapierRigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
        break;

      case RigidBodyType.KinematicVelocityBased:
        this._rapierRigidBodyDesc = RAPIER.RigidBodyDesc.kinematicVelocityBased();
        break;

      default:
        this._rapierRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic();
        break;
    }

    this._rapierRigidBodyDesc.setAdditionalMass(1);

    this._rapierRigidBodyDesc.setTranslation(x, y, z);

    this._rapierRigidBody = Globals._rapierWorld.createRigidBody(this._rapierRigidBodyDesc);
  }

  linvel(out) {
    let v = this._rapierRigidBody.linvel();

    out.x = v.x;
    out.y = v.y;
    out.z = v.z;
    return this;
  }

  onDetach() {
    Globals._rapierWorld.removeRigidBody(this._rapierRigidBody);
  }

  onDeactivate() {
    Globals._rapierWorld.removeRigidBody(this._rapierRigidBody);
  }

  onReactivate() {
    let {
      x,
      y,
      z
    } = this.transform.position;
    this._rapierRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);

    this._rapierRigidBodyDesc.setAdditionalMass(1);

    this._rapierRigidBody = Globals._rapierWorld.createRigidBody(this._rapierRigidBodyDesc);
  }
  /**Reset the forces to zero.*/


  resetForces(wake) {
    this._rapierRigidBody.resetForces(wake);

    return this;
  }
  /**Reset torques to zero*/


  resetTorques(wake) {
    this._rapierRigidBody.resetTorques(wake);

    return this;
  }

  addForce(v, wake) {
    this._rapierRigidBody.addForce(v, wake);

    return this;
  }

  addTorque(v, wake) {
    this._rapierRigidBody.addTorque(v, wake);

    return this;
  }

  addForceAtPoint(v, p, wake) {
    this._rapierRigidBody.addForceAtPoint(v, p, wake);

    return this;
  }

  applyImpulse(v, wake) {
    this._rapierRigidBody.applyImpulse(v, wake);

    return this;
  }

  applyTorqueImpulse(v, wake) {
    this._rapierRigidBody.applyTorqueImpulse(v, wake);

    return this;
  }

  applyImpulseAtPoint(v, p, wake) {
    this._rapierRigidBody.applyImpulseAtPoint(v, p, wake);

    return this;
  }

  lockTranslations(locked, wake) {
    this._rapierRigidBody.lockTranslations(locked, wake);

    return this;
  }

  lockRotations(locked, wake) {
    this._rapierRigidBody.lockRotations(locked, wake);

    return this;
  }

  setEnabledRotations(x, y, z, wake) {
    this._rapierRigidBody.setEnabledRotations(x, y, z, wake);

    return this;
  }

  setLinearDamping(d) {
    this._rapierRigidBody.setLinearDamping(d);

    return this;
  }

  setAngularDamping(d) {
    this.setAngularDamping(d);
    return this;
  }

  setDominanceGroup(g) {
    this._rapierRigidBody.setDominanceGroup(g);

    return this;
  }

  enableCcd(enable) {
    this._rapierRigidBody.enableCcd(enable);

    return this;
  }

}