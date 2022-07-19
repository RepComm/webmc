
import { Collider, CollisionCheck, CollisionInfo } from "./collider.js";
import { CubeCollider } from "./cubecollider.js";
import { Chunk } from "./chunk.js";

export class ChunkCollider extends Collider {
  chunk: Chunk;
  
  constructor () {
    super();
  }
  onAttach(): void {
    this.chunk = this.getComponent(Chunk);
  }
  collisionCheck(b: Collider, info: CollisionInfo): CollisionCheck {
    if (b instanceof CubeCollider) {
      let minx = Math.floor(b.minx);
    } else {
      return CollisionCheck.NO_DEFER;
    }
  }
}
