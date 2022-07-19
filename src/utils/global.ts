
import type { World as PhysicsWorld } from "@dimforge/rapier3d-compat";

import { OGLRenderingContext, Vec3 } from "ogl-typescript";

export class Globals {
  static gl: OGLRenderingContext;
  static delta: number;
  static gravity: Vec3;
  static _rapierWorld: PhysicsWorld;
}
Globals.delta = 1000 / 20;
Globals.gravity = new Vec3(0, -9.8, 0);
