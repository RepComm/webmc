import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { WorldComponent } from "./worldcomponent.js";

function fixNaNVec3 (v: Vec3) {
  if (isNaN(v.x)) v.x = 0;
  if (isNaN(v.y)) v.y = 0;
  if (isNaN(v.z)) v.z = 0;
}

export class RigidBody extends WorldComponent {
  velocity: Vec3;
  deltaVelocity: Vec3;
  mass: number;
  drag: number;
  useGravity: boolean;

  constructor () {
    super();
    this.velocity = new Vec3();
    this.deltaVelocity = new Vec3();
    this.setMass(5);
    this.useGravity = false;

    this.onUpdate = ()=>{
      if (this.useGravity) this.addForce(Globals.gravity);
      this.deltaVelocity.copy(this.velocity);
      this.deltaVelocity.multiply(Globals.delta);
      this.deltaVelocity.divide(this.mass);
      // this.deltaVelocity.multiply( this.velocity.len() * this.drag + 0.01 );
      // fixNaNVec3(this.deltaVelocity);
      // fixNaNVec3(this.velocity);

      this.transform.position.add(this.deltaVelocity);
    };
  }
  setUseGravity (g: boolean): this {
    this.useGravity = g;
    return this;
  }
  setMass (m: number): this {
    this.mass = m;
    return this;
  }
  addForce (v: Vec3): this {
    this.velocity.add(v);
    return this;
  }
}
