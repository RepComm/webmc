
import { Attribute, Geometry, OGLRenderingContext, Mesh as OGLMesh, Program } from "ogl-typescript";
import { Component } from "../ecs.js";
import { Globals } from "../utils/global.js";
import { MeshBuilder, MeshBuilderBuildResult } from "../utils/meshbuilder.js";
import { Transform } from "./transform.js";

export interface GeometryAttrs {
  [key: string]: Partial<Attribute>;
}

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

let DefaultProgram: Program;
function getDefaultProgram(): Program {
  if (!DefaultProgram) {
    DefaultProgram = new Program(Globals.gl, {
      vertex: /* glsl */ `
        attribute vec3 position;
    
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
    
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `
        void main() {
          gl_FragColor = vec4(1.0);
        }
      `,
    });
  }
  return DefaultProgram;
}

export interface MeshGeomChangeEvt {
  meshChanged: boolean;
}

export class Mesh extends Component {
  _oglMesh: OGLMesh;
  _customGeometry: CustomGeometry;
  _program: Program;

  constructor(program?: Program) {
    super();

    this._program = program||getDefaultProgram();
    // console.log(this._program);

    this._customGeometry = new CustomGeometry(Globals.gl, {
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

    this._oglMesh = new OGLMesh(Globals.gl, {
      geometry: this._customGeometry,
      frustumCulled: false,
      program: this._program, //TODO - replace with program component
      // mode: Globals.gl.LINE_STRIP
    });
  }
  updateGeometry(gl: OGLRenderingContext, attributes: GeometryAttrs) {
    this._customGeometry.updateGeometry(gl, attributes);
    let msg: MeshGeomChangeEvt = {
      meshChanged: true
    };

    this.sendMessage(msg);
    // console.log("updating geometry", attributes);
  }
  updateGeometryFromMeshBuilder (gl: OGLRenderingContext, mbr: MeshBuilderBuildResult) {
    this.updateGeometry(gl, {
      position: {
        size: 3,
        data: mbr.vs
      },
      uv: {
        size: 2,
        data: mbr.uvs
      },
      normal: {
        size: 3,
        data: mbr.vs//ns //TODO - calculate normals properly
      }
    });
    
  }
  onAttach(): void {
    let transform = this.getComponent(Transform);
    this._oglMesh.setParent(transform._oglTransform);
  }
  onDetach(): void {
    this._oglMesh.setParent(null);
  }
}
