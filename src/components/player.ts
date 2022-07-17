
import { Program } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { MeshBuilder } from "../utils/meshbuilder.js";
import { Mesh } from "./mesh.js";
import { PlayerController } from "./playercontroller.js";
import { WorldComponent } from "./worldcomponent.js";

export class Player extends WorldComponent {
  isLocalUser: boolean;

  mesh: Mesh;
  controller: PlayerController;

  constructor () {
    super();
    
  }
  onAttach(): void {
    this.isLocalUser = true;
    
    let playerMaterial = new Program(Globals.gl, {
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
          gl_FragColor = vec4(0.7, 0.8, 1.0, 1.0);
        }
      `,
    });

    this.mesh = new Mesh(playerMaterial);
    this.entity.addComponent(this.mesh)
  
    let mb = new MeshBuilder();
    mb.clear();
    mb.cube(0, 0, 0, 1, 1, 1);
    let data = mb.build();
    this.mesh.updateGeometryFromMeshBuilder(Globals.gl, data);
  
    this.controller = this.getOrCreateComponent(PlayerController);
    
  }
}
