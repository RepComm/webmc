
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
  
    this.mesh = new Mesh();
    this.entity.addComponent(this.mesh);
  
    let mb = new MeshBuilder();
    mb.clear();
    mb.cube(0, 0, 0, 1, 1, 1);
    let data = mb.build();
    this.mesh.updateGeometryFromMeshBuilder(Globals.gl, data);
  
    this.controller = new PlayerController();
    this.entity.addComponent(this.controller);
    
  }
}
