export class Block {
  constructor() {}
  /**Like isTransparent but named for future proofing*/


  get revealsNeighbors() {
    return this.type == 0;
  }

}
Block.DATA_SIZE = 1;