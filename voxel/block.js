import { Vec3 } from "ogl-typescript";
export class Block {
  constructor() {
    this.position = new Vec3(0, 0, 0);
  }
  /**Like isTransparent but named for future proofing*/


  get revealsNeighbors() {
    return this.type == 0;
  }

}
Block.DATA_SIZE = 1;