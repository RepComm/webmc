
import { Program, TextureLoader, Vec2, Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { MeshBuilder, MeshBuilderCubeSides } from "../utils/meshbuilder.js";
import { Block } from "../voxel/block.js";
// import { ChunkCollider } from "./chunkcollider.js";
import { Mesh } from "./mesh.js";
import { MeshCollider } from "./meshcollider.js";
import { RigidBody, RigidBodyType } from "./rigidbody.js";
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
  meshCollider: MeshCollider;
  rb: RigidBody;

  private data: Uint8Array;
  private renderBlock: Block;
  private neighborBlock: Block;
  private renderBlockSides: MeshBuilderCubeSides;

  // chunkCollider: ChunkCollider;

  constructor() {
    super();
    this.data = new Uint8Array(Chunk.DATA_SIZE);
    this.renderBlock = new Block();
    this.neighborBlock = new Block();
    this.renderBlockSides = {};
  }
  onAttach(): void {
    Globals.debugChunk = this;
    // let blocksTexture = TextureLoader.load(Globals.gl, {
    //   src: "./textures/side_grass.png",
    //   magFilter: Globals.gl.NEAREST,
    //   // minFilter: Globals.gl.NEAREST
    // });
    // console.log(blocksTexture);
    let chunkMaterial = new Program(Globals.gl, {
      vertex: `
        attribute vec2 uv;
        attribute vec3 position;
        attribute vec3 normal;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat3 normalMatrix;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 tex = texture2D(tMap, vUv).rgb;
          
          vec3 light = normalize(vec3(0.5, 1.0, -0.3));
          float shading = dot(normal, light) * 0.15;
          
          gl_FragColor.rgb = tex + shading;
          gl_FragColor.a = 1.0;
        }`,
      uniforms: {
        tMap: { value: Globals.atlas.texture },
        // tMap: { value: blocksTexture },
      },
    });
    this.mesh = new Mesh(chunkMaterial);
    this.entity.addComponent(this.mesh);
    // this.mesh = this.getOrCreateComponent(Mesh);

    this.rb = new RigidBody();
    this.rb.type = RigidBodyType.FIXED;
    this.entity.addComponent(this.rb);
    this.meshCollider = this.getOrCreateComponent(MeshCollider);


    this.generate();
    this.rebuild();
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
  setBlockData(b: Block, x: number, y?: number, z?: number, checkBounds: boolean = true, rebuild: boolean = true): boolean {
    let index = 0;
    if (!y || !z) {
      index = x;
    } else {
      if (checkBounds && !Chunk.isPositionBounded(x, y, z)) {
        return false;
      }
      index = Chunk.positionToIndex(x, y, z);
    }
    if (checkBounds && index < 0 || index > this.data.length) return false;
    this.data[index] = b.type;
    if (rebuild) this.rebuild();
    return true;
  }
  generate() {
    for (let x = 0; x < Chunk.BLOCK_SIDE_LENGTH; x++) {
      for (let y = 0; y < Chunk.BLOCK_SIDE_LENGTH; y++) {
        for (let z = 0; z < Chunk.BLOCK_SIDE_LENGTH; z++) {
          let i = Chunk.positionToIndex(x, y, z);
          if (x >= y) {
            this.data[i] = 1;
          } else {
            this.data[i] = 0;
          }
        }
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
    this.meshCollider.setTrimesh(data.vs, data.inds);
  }
}

Chunk.BLOCK_SIDE_LENGTH = 16;
Chunk.DATA_SIZE = Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Block.DATA_SIZE;

