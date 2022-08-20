
import { WorldEntity } from "./worldentity.js";
import { Mesh } from "../components/mesh.js";
import { Globals } from "../utils/global.js";
import { MeshBuilder } from "../utils/meshbuilder.js";
import { Program } from "ogl-typescript";

export class DebugEntity extends WorldEntity {
  mesh: Mesh;

  constructor () {
    super();

    this.mesh = new Mesh();

    let mb = new MeshBuilder();
    mb.clear();
    mb.cube(-0.05, -0.05, -0.05, 1.1, 1.1, 1.1);
    
    this.mesh.updateGeometryFromMeshBuilder(Globals.gl, mb.build());

    this.addComponent(this.mesh);
  }
  setActive (active: boolean = true): this {
    if (active) {
      this.transform.setParent(Globals.scene);
    } else {
      this.transform.setParent(null);
    }
    return this;
  }
}
