
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
  scale: Vec3;
  up: Vec3;
  quaternion: Quat;
  rotation: Euler;

  constructor() {
    super();
    this._oglTransform = new OGLTransform();
    this._oglTransform[ESC_COMPONENT_NAMESPACE] = this;
    Object.assign(this, this._oglTransform);

    this.setParent = (...a) => this._oglTransform.setParent(...a);
    this.addChild = (...a) => this._oglTransform.addChild(...a);
    this.removeChild = (...a) => this._oglTransform.removeChild(...a);
    this.updateMatrixWorld = (...a) => this._oglTransform.updateMatrixWorld(...a);
    this.updateMatrix = (...a) => this._oglTransform.updateMatrix(...a);
    this.traverse = (...a) => this._oglTransform.traverse(...a);
    this.decompose = (...a) => this._oglTransform.decompose(...a);
    this.lookAt = (...a) => this._oglTransform.lookAt(...a);
  }
  setParent: (parent: any, notifyParent?: boolean) => void;
  addChild: (child: OGLTransform, notifyChild?: boolean) => void;
  removeChild: (child: OGLTransform, notifyChild?: boolean) => void;
  updateMatrixWorld: (force?: boolean) => void;
  updateMatrix: () => void;
  traverse: (callback: (node: OGLTransform) => boolean | void) => void;
  decompose: () => void;
  lookAt: <T extends number[]>(target: T, invert?: boolean) => void;
}
