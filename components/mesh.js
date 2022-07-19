import { Geometry, Mesh as OGLMesh, Program } from "ogl-typescript";
import { Component } from "../ecs.js";
import { Globals } from "../utils/global.js";
import { Transform } from "./transform.js";
export class CustomGeometry extends Geometry {
  constructor(gl, attributes) {
    super(gl, attributes);
  }

  updateGeometry(gl, attributes) {
    this.attributes = attributes; // Store one VAO per program attribute locations order

    this.VAOs = {};
    this.drawRange = {
      start: 0,
      count: 0
    };
    this.instancedCount = 0; // Unbind current VAO so that new buffers don't get added to active mesh

    this.gl.renderer.bindVertexArray(null);
    this.gl.renderer.currentGeometry = null; // Alias for state store to avoid redundant calls for global state

    this.glState = this.gl.renderer.state; // create the buffers

    for (let key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }

}
let DefaultProgram;

function getDefaultProgram() {
  if (!DefaultProgram) {
    DefaultProgram = new Program(Globals.gl, {
      vertex:
      /* glsl */
      `
        attribute vec3 position;
    
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
    
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment:
      /* glsl */
      `
        void main() {
          gl_FragColor = vec4(1.0);
        }
      `
    });
  }

  return DefaultProgram;
}

export class Mesh extends Component {
  constructor(program) {
    super();
    this._program = program || getDefaultProgram(); // console.log(this._program);

    this._customGeometry = new CustomGeometry(Globals.gl, {
      position: {
        size: 3,
        data: new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0])
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 1, 1])
      },
      normal: {
        size: 3,
        data: new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0])
      }
    });
    this._oglMesh = new OGLMesh(Globals.gl, {
      geometry: this._customGeometry,
      frustumCulled: false,
      program: this._program //TODO - replace with program component
      // mode: Globals.gl.LINE_STRIP

    });
  }

  updateGeometry(gl, attributes) {
    this._customGeometry.updateGeometry(gl, attributes); // console.log("updating geometry", attributes);

  }

  updateGeometryFromMeshBuilder(gl, mbr) {
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
        data: mbr.vs //ns //TODO - calculate normals properly

      }
    });
  }

  onAttach() {
    let transform = this.getComponent(Transform);

    this._oglMesh.setParent(transform._oglTransform);
  }

  onDetach() {
    this._oglMesh.setParent(null);
  }

}