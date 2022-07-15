
import { Attribute, Geometry, OGLRenderingContext, Texture, TextureLoader } from "ogl-typescript";
import { MeshBuilder, MeshBuilderCubeSides } from "../utils/meshbuilder.js";
import { Block } from "./block.js";

export interface GeometryAttrs {
  [key: string]: Partial<Attribute>;
}

export class Chunk extends Geometry {
  private static chunkMeshBuilder: MeshBuilder;

  static getMeshBuilder(): MeshBuilder {
    if (!Chunk.chunkMeshBuilder) Chunk.chunkMeshBuilder = new MeshBuilder();
    return Chunk.chunkMeshBuilder;
  }

  static BLOCK_SIDE_LENGTH: number;
  static DATA_SIZE: number;

  private data: Uint8Array;
  private renderBlock: Block;
  private neighborBlock: Block;
  private renderBlockSides: MeshBuilderCubeSides;

  private blocksTexture: Texture;

  constructor(gl: OGLRenderingContext, { attributes = {} } = {}) {

    let mb = Chunk.getMeshBuilder();
    mb.clear();
    mb.cube(0, 0, 0, 1, 1, 1, {
      back_ZN: true,
      bottom_YN: true,
      front_Z: true,
      left_XN: true,
      right_X: true,
      top_Y: true
    });

    let data = mb.build();

    Object.assign(attributes, {
      position: {
        size: 3,
        data: data.vs/*new Float32Array([
          -1, -1, 0,
          3, -1, 0,
          -1, 3, 0
        ])*/
      },
      uv: {
        size: 2,
        data: data.uvs/*new Float32Array([
          0, 0,
          2, 0,
          0, 2
        ])*/
      },
    });

    super(gl, attributes);

    this.data = new Uint8Array(Chunk.DATA_SIZE);
    this.renderBlock = new Block();
    this.neighborBlock = new Block();

    this.renderBlockSides = {};
  
    
    setTimeout(()=>{
      this.blocksTexture = TextureLoader.load(gl, {
        src: "./textures/top_grass.png"
      });
      
      this.generate();
      this.rebuild();
    }, 4000);
  }
  updateGeometry(gl: OGLRenderingContext, attributes: GeometryAttrs) {
    this.attributes = attributes;
    // Store one VAO per program attribute locations order
    this.VAOs = {};
    this.drawRange = { start: 0, count: 0 };
    this.instancedCount = 0;
    // Unbind current VAO so that new buffers don't get added to active mesh
    this.gl.renderer.bindVertexArray(null);
    this.gl.renderer.currentGeometry = null;
    // Alias for state store to avoid redundant calls for global state
    this.glState = this.gl.renderer.state;
    // create the buffers
    for (let key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }
  static positionToIndex(x: number, y: number, z: number): number {
    return (
      Math.floor(x) +
      Math.floor(y) * Chunk.BLOCK_SIDE_LENGTH +
      Math.floor(z) * Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH
    );
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
      if (checkBounds && !Chunk.isPositionBounded(x, y, z)) return false;
      index = Chunk.positionToIndex(x, y, z);
    }
    out.type = this.data[index];
    return true;
  }
  generate () {
    for (let i = 0; i < this.data.byteLength; i++) {
      this.data[i] = Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 255);
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

    this.updateGeometry(this.gl, {
      position: {
        size: 3,
        data: data.vs
      },
      uv: {
        size: 2,
        data: data.uvs
      }
    });
  }
}

Chunk.BLOCK_SIDE_LENGTH = 16;
Chunk.DATA_SIZE = Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Block.DATA_SIZE;
