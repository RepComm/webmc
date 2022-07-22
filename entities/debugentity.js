import { WorldEntity } from "./worldentity.js";
import { Mesh } from "../components/mesh.js";
import { Globals } from "../utils/global.js";
import { MeshBuilder } from "../utils/meshbuilder.js";
export class DebugEntity extends WorldEntity {
  constructor() {
    super();
    this.mesh = new Mesh();
    let mb = new MeshBuilder();
    mb.clear();
    mb.cube(-0.1, -0.1, -0.1, 1.2, 1.2, 1.2);
    this.mesh.updateGeometryFromMeshBuilder(Globals.gl, mb.build());
    this.addComponent(this.mesh);
  }

  setActive(active = true) {
    if (active) {
      this.transform.setParent(Globals.scene);
    } else {
      this.transform.setParent(null);
    }

    return this;
  }

}