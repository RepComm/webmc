
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { MeshBuilder, MeshBuilderCubeSides } from "../utils/meshbuilder.js";
import { Block } from "../voxel/block.js";
import { Mesh } from "./mesh.js";
import { WorldComponent } from "./worldcomponent.js";

export class Chunk extends WorldComponent {

  private static chunkMeshBuilder: MeshBuilder;
  static getMeshBuilder(): MeshBuilder {
    if (!Chunk.chunkMeshBuilder) Chunk.chunkMeshBuilder = new MeshBuilder();
    return Chunk.chunkMeshBuilder;
  }
  
  static BLOCK_SIDE_LENGTH: number;
  static DATA_SIZE: number;
  
  mesh: Mesh;

  private data: Uint8Array;
  private renderBlock: Block;
  private neighborBlock: Block;
  private renderBlockSides: MeshBuilderCubeSides;

  constructor () {
    super();
    this.data = new Uint8Array(Chunk.DATA_SIZE);
    this.renderBlock = new Block();
    this.neighborBlock = new Block();
    this.renderBlockSides = {};
  }
  onAttach(): void {
    this.mesh = this.getOrCreateComponent(Mesh) as Mesh;
    
    setTimeout(() => {
      this.generate();
      this.rebuild();

    }, 500);
  }

  static positionToIndex(x: number, y: number, z: number): number {
    return (
      Math.floor(x) +
      Math.floor(y) * Chunk.BLOCK_SIDE_LENGTH +
      Math.floor(z) * Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH
    );
  }
  static indexToPosition(index: number, out: Vec3) {
    out.z = index % Chunk.BLOCK_SIDE_LENGTH;
    out.y = (index / Chunk.BLOCK_SIDE_LENGTH) % Chunk.BLOCK_SIDE_LENGTH;
    out.x = index / (Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH);
  }
  static isPositionBounded(x: number, y: number, z: number): boolean {
    return (
      x > -1 && x < Chunk.BLOCK_SIDE_LENGTH &&
      y > -1 && y < Chunk.BLOCK_SIDE_LENGTH &&
      z > -1 && z < Chunk.BLOCK_SIDE_LENGTH
    );
  }
  /**Get a block's data from is position
   * Outputs to supplied block 'out'
   * 
   * If checkBounds is true, x y z check fit within chunk coords and return false if out of bounds
   * otherwise always returns true
   */
  getBlockData(out: Block, x: number, y?: number, z?: number, checkBounds: boolean = true): boolean {
    let index = 0;
    if (!y || !z) {
      index = x;
    } else {
      if (checkBounds && !Chunk.isPositionBounded(x, y, z)) {
        out.type = 0;
        return false;
      }
      index = Chunk.positionToIndex(x, y, z);
    }
    out.type = this.data[index];
    return true;
  }
  generate() {
    let position = new Vec3();
    let origin = new Vec3(Chunk.BLOCK_SIDE_LENGTH / 2, Chunk.BLOCK_SIDE_LENGTH / 2, Chunk.BLOCK_SIDE_LENGTH / 2);

    for (let i = 0; i < this.data.byteLength; i++) {
      Chunk.indexToPosition(i, position);
      if (position.distance(origin) < Chunk.BLOCK_SIDE_LENGTH / 2) {
        this.data[i] = 1;
      } else {
        this.data[i] = 0;
      }

    }
  }
  rebuild() {
    let mb = Chunk.getMeshBuilder();
    mb.clear();

    for (let x = 0; x < Chunk.BLOCK_SIDE_LENGTH; x++) {
      for (let y = 0; y < Chunk.BLOCK_SIDE_LENGTH; y++) {
        for (let z = 0; z < Chunk.BLOCK_SIDE_LENGTH; z++) {
          this.getBlockData(this.renderBlock, x, y, z);
          if (this.renderBlock.type === 0) continue;
          this.renderBlockSides.back_ZN = true;
          this.renderBlockSides.front_Z = true;
          this.renderBlockSides.left_XN = true;
          this.renderBlockSides.right_X = true;
          this.renderBlockSides.top_Y = true;
          this.renderBlockSides.bottom_YN = true;

          //check neighbors for transparency
          if (this.getBlockData(this.neighborBlock, x, y + 1, z)) this.renderBlockSides.top_Y = this.neighborBlock.revealsNeighbors;
          if (this.getBlockData(this.neighborBlock, x, y - 1, z)) this.renderBlockSides.bottom_YN = this.neighborBlock.revealsNeighbors;
          if (this.getBlockData(this.neighborBlock, x, y, z - 1)) this.renderBlockSides.back_ZN = this.neighborBlock.revealsNeighbors;
          if (this.getBlockData(this.neighborBlock, x, y, z + 1)) this.renderBlockSides.front_Z = this.neighborBlock.revealsNeighbors;
          if (this.getBlockData(this.neighborBlock, x - 1, y, z)) this.renderBlockSides.left_XN = this.neighborBlock.revealsNeighbors;
          if (this.getBlockData(this.neighborBlock, x + 1, y, z)) this.renderBlockSides.right_X = this.neighborBlock.revealsNeighbors;

          mb.cube(x, y, z, 1, 1, 1, this.renderBlockSides);

        }
      }
    }

    let data = mb.build();

    this.mesh.updateGeometryFromMeshBuilder(Globals.gl, data);
  }
}

Chunk.BLOCK_SIDE_LENGTH = 16;
Chunk.DATA_SIZE = Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Block.DATA_SIZE;

