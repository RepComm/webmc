/*
import { Attribute, Geometry, Mesh, OGLRenderingContext, Program, Texture, TextureLoader, Vec3 } from "ogl-typescript";
import { GeometryAttrs } from "../components/mesh.js";
import { MeshBuilder, MeshBuilderCubeSides } from "../utils/meshbuilder.js";
import { Block } from "./block.js";

export class CustomGeometry extends Geometry {
  constructor(gl: OGLRenderingContext, attributes: GeometryAttrs) {
    super(gl, attributes);
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
}

export class Chunk extends Mesh {
  private static chunkMeshBuilder: MeshBuilder;

  static getMeshBuilder(): MeshBuilder {
    if (!Chunk.chunkMeshBuilder) Chunk.chunkMeshBuilder = new MeshBuilder();
    return Chunk.chunkMeshBuilder;
  }

  static BLOCK_SIDE_LENGTH: number;
  static DATA_SIZE: number;

  private static customProgram: Program;

  private customGeometry: CustomGeometry;

  private data: Uint8Array;
  private renderBlock: Block;
  private neighborBlock: Block;
  private renderBlockSides: MeshBuilderCubeSides;

  private blocksTexture: Texture;

  constructor(gl: OGLRenderingContext) {
    if (!Chunk.customProgram) {
      const vertex = /* glsl */ `
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
        }
        `;
      let fragment = `
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
        }`;
      let blocksTexture = TextureLoader.load(gl, {
        src: "./textures/top_grass.png"
      });
      Chunk.customProgram = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: { value: blocksTexture },
        },
      });
    }

    let customGeometry = new CustomGeometry(gl, {
      position: {
        size: 3, data: new Float32Array([
          0, 0, 0,
          0, 1, 0,
          1, 1, 0
        ])
      },
      uv: {
        size: 2, data: new Float32Array([
          0, 0, 1,
          0, 1, 1
        ])
      },
      normal: {
        size: 3, data: new Float32Array([
          0, 0, 0,
          0, 1, 0,
          1, 1, 0
        ])
      }
    });

    //TODO - figure out how to fix frustum so it can cull properly
    super(gl, {
      geometry: customGeometry,
      frustumCulled: false,
      program: Chunk.customProgram,
      // mode: gl.LINE_STRIP
    });

    this.customGeometry = customGeometry;
    this.blocksTexture = this.blocksTexture;

    this.data = new Uint8Array(Chunk.DATA_SIZE);
    this.renderBlock = new Block();
    this.neighborBlock = new Block();

    this.renderBlockSides = {};


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

    this.customGeometry.updateGeometry(this.gl, {
      position: {
        size: 3,
        data: data.vs
      },
      uv: {
        size: 2,
        data: data.uvs
      },
      normal: {
        size: 3,
        data: data.vs
      }
    });
  }
}

Chunk.BLOCK_SIDE_LENGTH = 16;
Chunk.DATA_SIZE = Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Chunk.BLOCK_SIDE_LENGTH * Block.DATA_SIZE;
*/