import { Component } from "../ecs.js";
import { Euler, Quat, Transform as OGLTransform, Vec3 } from "ogl-typescript";
import { WorldEntity } from "../entities/worldentity.js";
export const ESC_COMPONENT_NAMESPACE = "__ecs_component";
export class Transform extends Component {
  get entity() {
    return this._entity;
  }

  getParent() {
    return this._oglTransform.parent[ESC_COMPONENT_NAMESPACE];
  }

  constructor() {
    super();
    this._oglTransform = new OGLTransform();
    this._oglTransform[ESC_COMPONENT_NAMESPACE] = this;
    Object.assign(this, this._oglTransform);
    this.worldPosition = new Vec3();
    this.worldScale = new Vec3(1);
    this.worldQuaternion = new Quat();
    this.worldRotation = new Euler(); // this.setParent = (...a) => this._oglTransform.setParent(...a);
    // this.addChild = (...a) => this._oglTransform.addChild(...a);
    // this.removeChild = (...a) => this._oglTransform.removeChild(...a);

    this.updateMatrixWorld = (...a) => this._oglTransform.updateMatrixWorld(...a);

    this.updateMatrix = (...a) => this._oglTransform.updateMatrix(...a);

    this.traverse = (...a) => this._oglTransform.traverse(...a); // this.decompose = () => this._oglTransform.decompose();


    this.lookAt = (...a) => this._oglTransform.lookAt(...a);
  }

  setParent(parent, notifyParent) {
    if (parent instanceof WorldEntity) {
      this._oglTransform.setParent(parent.transform._oglTransform, notifyParent);
    } else {
      this._oglTransform.setParent(parent, notifyParent);
    }

    return this;
  }

  addChild(child, notifyChild) {
    if (child instanceof WorldEntity) {
      this._oglTransform.addChild(child.transform, notifyChild);
    } else {
      this._oglTransform.addChild(child, notifyChild);
    }

    return this;
  }

  removeChild(child, notifyChild) {
    if (child instanceof WorldEntity) {
      this._oglTransform.removeChild(child.transform, notifyChild);
    } else {
      this._oglTransform.removeChild(child, notifyChild);
    }

    return this;
  }

  // decompose: () => void;
  decompose() {
    //local matrix decompose
    this._oglTransform.decompose(); //world matrix decompose


    this.worldMatrix.getTranslation(this.worldPosition);
    this.worldMatrix.getRotation(this.worldQuaternion);
    this.worldMatrix.getScaling(this.worldScale);
    this.worldRotation.fromQuaternion(this.worldQuaternion);
  }

}