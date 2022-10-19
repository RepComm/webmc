
import { AddQueue } from "../utils/addqueue.js";
import type { Vec3Like } from "../utils/math";

export interface ChunkOptions {
  blockByteLength: number;
  sideLength: number;
}

export type BlockData = Uint8Array;

export interface BlockInfo {
  index: number;
  blockData: BlockData;
  posChunk: Vec3Like;
  isBounded: boolean;
}

export interface NeighborInfo extends BlockInfo {
  posNeighbor: Vec3Like;
}

export interface NeighborCallback {
  (info: NeighborInfo): void;
}

export enum BFSSeedMode {
  CALLBACK,
  LIST
}
export interface BFSSeedCallback {
  (info: BlockInfo): boolean;
}
export enum BFSResultMode {
  CALLBACK,
  INDEX_ARRAY
}
export interface BFSResultCallback {
  (info: BlockInfo): void;
}
export interface BFSShouldVisitCallback {
  (info: NeighborInfo): boolean;
}
export interface BFSOptions {
  seedMode: BFSSeedMode;
  seedList?: Array<number>;
  seedCallback?: BFSSeedCallback;
  shouldVisitCallback: BFSShouldVisitCallback;
}

export class ChunkData {
  data: Uint8Array;


  options: ChunkOptions;
  blockCount: number;

  getAtOut: Uint8Array;
  neighborOut: Uint8Array;
  neighborInfo: NeighborInfo;

  bfsBlockInfo: BlockInfo;

  constructor (options: ChunkOptions) {
    this.options = options;

    this.blockCount = Math.pow( this.options.sideLength, 3 );

    this.data = new Uint8Array(
      this.options.blockByteLength *
      this.blockCount
    );

    this.getAtOut = new Uint8Array(this.options.blockByteLength);
    this.neighborOut = new Uint8Array(this.options.blockByteLength);

    this.neighborInfo = {
      index: 0,
      blockData: this.neighborOut,
      isBounded: false,
      posChunk: {x: 0, y: 0, z: 0},
      posNeighbor: {x: 0, y: 0, z: 0}
    };

    this.bfsBlockInfo = {
      blockData: this.getAtOut,
      index: 0,
      isBounded: false,
      posChunk: {x: 0, y: 0, z: 0}
    };

  }
  posToIdx(v: Vec3Like): number {
    return (
      Math.floor(v.x) +
      Math.floor(v.y) * this.options.sideLength +
      Math.floor(v.z) * this.options.sideLength * this.options.sideLength
    );
  }
  idxToPos(index: number, out: Vec3Like) {
    out.z = index % this.options.sideLength;
    out.y = (index / this.options.sideLength) % this.options.sideLength;
    out.x = index / (this.options.sideLength * this.options.sideLength);
  }
  isPosBounded(v: Vec3Like): boolean {
    return (
      v.x > -1 && v.x < this.options.sideLength &&
      v.y > -1 && v.y < this.options.sideLength &&
      v.z > -1 && v.z < this.options.sideLength
    );
  }
  asVec3 (v: Vec3Like|number): Vec3Like {
    if ((v as Vec3Like).x) {
      return v as Vec3Like;
    } else {
      let idx = v as number;
      let v2 = {} as Vec3Like;
      this.idxToPos(idx, v2);
      return v2;
    }
  }
  getAtIndex (idx: number, out: Uint8Array = undefined): Uint8Array {
    if (out === undefined) out = this.getAtOut;

    //blockOffset to byte offset
    idx *= this.options.blockByteLength;

    //copy the data
    for (let i=0; i<this.options.blockByteLength; i++) {
      out[i] = this.data[idx + i];
    }

    //return the copied data
    return out;
  }
  getAt (v: Vec3Like|number, out: Uint8Array = undefined): Uint8Array {
    if (out === undefined) out = this.getAtOut;

    //calculate the index
    let idx = 0;
    if ( (v as Vec3Like).x ) {
      idx = this.posToIdx(v as Vec3Like);
    } else {
      idx = v as number;
    }
    
    return this.getAtIndex(idx, out);
  }
  getNeighbors (v: Vec3Like, cb: NeighborCallback, ignoreOutOfBounds: boolean = true) {
    for (let x=0; x<3; x++) {
      for (let y=0; y<3; y++) {
        for (let z=0; z<3; z++) {
          //neighbor relative coordinates
          this.neighborInfo.posNeighbor.x = x-1;
          this.neighborInfo.posNeighbor.y = y-1;
          this.neighborInfo.posNeighbor.z = z-1;

          //chunk relative coordinates
          this.neighborInfo.posChunk.x = v.x + this.neighborInfo.posNeighbor.x;
          this.neighborInfo.posChunk.y = v.y + this.neighborInfo.posNeighbor.y;
          this.neighborInfo.posChunk.z = v.z + this.neighborInfo.posNeighbor.z;

          //ignore center block as it is not a neighbor to itself
          if (
            this.neighborInfo.posChunk.x == v.x &&
            this.neighborInfo.posChunk.y == v.y &&
            this.neighborInfo.posChunk.z == v.z
          ) continue;
          
          //calculate boundedness
          this.neighborInfo.isBounded = this.isPosBounded(
            this.neighborInfo.posChunk
          );
          
          //ignore if we don't want out of bounds to callback
          if (ignoreOutOfBounds && !this.neighborInfo.isBounded) continue;
          
          //populate index coordinate
          this.neighborInfo.index = this.posToIdx(this.neighborInfo.posChunk);

          //read block data
          this.getAtIndex(this.neighborInfo.index, this.neighborOut);

          //explicitly set just in case
          this.neighborInfo.blockData = this.neighborOut;

          //callback with current neighbor info
          cb(this.neighborInfo);
        }
      }
    }
  }
  /**breadth first search*/
  bfs (options: BFSOptions): Set<number> {
    let visited = new Set<number>();
    let toVisit = new AddQueue<number>();

    switch(options.seedMode) {
      case BFSSeedMode.LIST:
        if (!options.seedList) throw `[BFS] options.seedMode is LIST, but no options.seedList provided!`;
        break;
      
      case BFSSeedMode.CALLBACK:
        if (!options.seedCallback) throw `[BFS] options.seedMode is CALLBACK, but no options.seedCallback provided!`;
        
        //create empty seedList
        options.seedList = [];

        //loop thru every block and calculate info, then see if callback wants to use each block as a seed
        for (let i=0; i<this.blockCount; i++) {
          this.bfsBlockInfo.blockData = this.getAtIndex(i, this.getAtOut);
          this.bfsBlockInfo.index = i;
          this.bfsBlockInfo.isBounded = true;
          this.idxToPos(i, this.bfsBlockInfo.posChunk);

          if (options.seedCallback(this.bfsBlockInfo)) {
            options.seedList.push(i);
          }
        }
        break;
      
      default:
        throw `[BFS] options.seedMode is unknown [${options.seedMode}], how do I aquire seeds for breadth first search?`;
        break;
    }

    //schedule a visit starting with the seeds
    toVisit.add(...options.seedList);

    while (toVisit.hasNext()) {
      //current node
      let idx = toVisit.next();
      this.bfsBlockInfo.index = idx;
      //x y z of this node
      this.idxToPos(this.bfsBlockInfo.index, this.bfsBlockInfo.posChunk);
      
      //mark as visited, remove from scheduled visit queue
      visited.add(idx); toVisit.remove();
      
      //calculate neighbors index and data
      this.getNeighbors(this.bfsBlockInfo.posChunk, (info)=>{
        //don't visit nodes that have already been visited
        if (visited.has(info.index)) return;
        
        //schedule a visit if shouldVisit
        if (options.shouldVisitCallback(info)) toVisit.add(info.index);

      }, true);
    }
    
    return visited;
  }
}
