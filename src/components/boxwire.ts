
import { Program } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { MeshBuilder } from "../utils/meshbuilder.js";
import { Mesh } from "./mesh.js";
import { WorldComponent } from "./worldcomponent.js";

export class BoxWire extends WorldComponent {
  mesh: Mesh;

  constructor() {
    super();

  }
  onAttach(): void {
    let BoxWireMaterial = new Program(Globals.gl, {
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
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);
        }
      `,
      transparent: true
    });


    this.mesh = new Mesh(BoxWireMaterial);
    this.entity.addComponent(this.mesh);

    let mb = new MeshBuilder();
    mb.clear();

    let smin = 0.02;
    let smax = 1 + smin;
    let min = -smin / 2;
    let max = min + 1;

    mb.cube(
      min, min, min,
      smin, smax, smin,
    );
    mb.cube(
      max, min, min,
      smin, smax, smin,
    );
    mb.cube(
      min, min, max,
      smin, smax, smin,
    );
    mb.cube(
      max, min, max,
      smin, smax, smin,
    );
    mb.cube(min, min, min, smax, smin, smin);
    mb.cube(min, max, min, smax, smin, smin);
    mb.cube(min, max, max, smax, smin, smin);
    mb.cube(min, min, max, smax, smin, smin);

    mb.cube(min, min, min, smin, smin, smax);
    mb.cube(min, max, min, smin, smin, smax);

    mb.cube(max, max, min, smin, smin, smax);
    mb.cube(max, min, min, smin, smin, smax);
    
    let data = mb.build();

    this.mesh.updateGeometryFromMeshBuilder(Globals.gl, data);
  }
}
