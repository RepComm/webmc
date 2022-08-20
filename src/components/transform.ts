
import { Component } from "../ecs.js";
import { Euler, Mat4, Quat, Transform as OGLTransform, Vec3 } from "ogl-typescript";
import { WorldEntity } from "../entities/worldentity.js";

export const ESC_COMPONENT_NAMESPACE = "__ecs_component";

export class Transform extends Component implements OGLTransform {
  protected _entity: WorldEntity;

  get entity (): WorldEntity {
    return this._entity;
  }

  getParent (): Transform {
    return this._oglTransform.parent[ESC_COMPONENT_NAMESPACE];
  }

  _oglTransform: OGLTransform;

  parent: OGLTransform;
  children: OGLTransform[];
  visible: boolean;
  matrix: Mat4;
  worldMatrix: Mat4;
  matrixAutoUpdate: boolean;
  worldMatrixNeedsUpdate: boolean;
  position: Vec3;
  worldPosition: Vec3;
  scale: Vec3;
  worldScale: Vec3;
  up: Vec3;
  quaternion: Quat;
  worldQuaternion: Quat;
  rotation: Euler;
  worldRotation: Euler;

  constructor() {
    super();
    this._oglTransform = new OGLTransform();
    this._oglTransform[ESC_COMPONENT_NAMESPACE] = this;
    Object.assign(this, this._oglTransform);

    this.worldPosition = new Vec3();
    this.worldScale = new Vec3(1);
    this.worldQuaternion = new Quat();
    this.worldRotation = new Euler();

    // this.setParent = (...a) => this._oglTransform.setParent(...a);
    // this.addChild = (...a) => this._oglTransform.addChild(...a);
    // this.removeChild = (...a) => this._oglTransform.removeChild(...a);
    this.updateMatrixWorld = (...a) => this._oglTransform.updateMatrixWorld(...a);
    this.updateMatrix = (...a) => this._oglTransform.updateMatrix(...a);
    this.traverse = (...a) => this._oglTransform.traverse(...a);
    // this.decompose = () => this._oglTransform.decompose();
    this.lookAt = (...a) => this._oglTransform.lookAt(...a);
  }
  setParent (parent: WorldEntity|OGLTransform|null, notifyParent?: boolean): this {
    if (parent instanceof WorldEntity) {
      this._oglTransform.setParent(parent.transform._oglTransform, notifyParent);
    } else {
      this._oglTransform.setParent(parent, notifyParent);
    }
    return this;
  }
  addChild (child: WorldEntity|OGLTransform, notifyChild?: boolean): this {
    if (child instanceof WorldEntity) {
      this._oglTransform.addChild( child.transform, notifyChild );
    } else {
      this._oglTransform.addChild( child, notifyChild );
    }
    return this;
  }
  removeChild (child: OGLTransform, notifyChild?: boolean): this {
    if (child instanceof WorldEntity) {
      this._oglTransform.removeChild( child.transform, notifyChild );
    } else {
      this._oglTransform.removeChild( child, notifyChild );
    }
    return this;
  }
  updateMatrixWorld: (force?: boolean) => void;
  updateMatrix: () => void;
  traverse: (callback: (node: OGLTransform) => boolean | void) => void;
  // decompose: () => void;
  decompose () {
    //local matrix decompose
    this._oglTransform.decompose();

    //world matrix decompose
    this.worldMatrix.getTranslation(this.worldPosition);
    this.worldMatrix.getRotation(this.worldQuaternion);
    this.worldMatrix.getScaling(this.worldScale);
    this.worldRotation.fromQuaternion(this.worldQuaternion);
  }
  lookAt: <T extends number[]>(target: T, invert?: boolean) => void;

}
