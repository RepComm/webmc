import { Collider, CollisionCheck } from "./collider.js";
import { CubeCollider } from "./cubecollider.js";
import { Chunk } from "./chunk.js";
export class ChunkCollider extends Collider {
  constructor() {
    super();
  }

  onAttach() {
    this.chunk = this.getComponent(Chunk);
  }

  collisionCheck(b, info) {
    if (b instanceof CubeCollider) {
      let minx = Math.floor(b.minx);
    } else {
      return CollisionCheck.NO_DEFER;
    }
  }

}