
import { Camera as OGLCamera } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { WorldComponent } from "./worldcomponent.js";

export class Camera extends WorldComponent {
  private _oglCamera: OGLCamera;

  constructor () {
    super();
    this._oglCamera = new OGLCamera(Globals.gl);
  }
  onAttach(): void {
    window.addEventListener("resize", ()=>this.onResize(), false);
    this.onResize();
    this._oglCamera.setParent(this.transform._oglTransform);
  }
  onResize () {
    this._oglCamera.perspective({
      aspect: Globals.gl.canvas.width / Globals.gl.canvas.height,
    });
  }
  setMainCamera () {
    Globals.mainCamera = this._oglCamera;
  }
}
