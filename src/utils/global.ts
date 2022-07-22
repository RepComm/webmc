
import type { World as PhysicsWorld } from "@dimforge/rapier3d-compat";
import type { Atlas } from "./atlas.js";
import type { WorldEntity } from "../entities/worldentity.js";
import type { Chunk } from "../components/chunk.js";

import { OGLRenderingContext, Vec3 } from "ogl-typescript";

export class Globals {
  static gl: OGLRenderingContext;
  static delta: number;
  static gravity: Vec3;
  static _rapierWorld: PhysicsWorld;
  static atlas: Atlas;
  static scene: WorldEntity;
  static debugChunk: Chunk;
}
Globals.delta = 1000 / 30;
Globals.gravity = new Vec3(0, -9.8, 0);
