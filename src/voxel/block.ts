
export class Block {
  static DATA_SIZE: number;

  type: number;

  constructor ( ) {

  }
  /**Like isTransparent but named for future proofing*/
  get revealsNeighbors(): boolean {
    return this.type !== 0;
  }
}
Block.DATA_SIZE = 1;
