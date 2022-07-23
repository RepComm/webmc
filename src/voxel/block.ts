
import { Vec3 } from "ogl-typescript";

export class Block {
  static DATA_SIZE: number;

  type: number;

  position: Vec3;

  constructor ( ) {
    this.position = new Vec3(0, 0, 0);
  }
  /**Like isTransparent but named for future proofing*/
  get revealsNeighbors(): boolean {
    return this.type == 0;
  }
}
Block.DATA_SIZE = 1;
