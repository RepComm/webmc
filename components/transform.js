import { Component } from "../ecs.js";
import { Transform as OGLTransform } from "ogl-typescript";
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

    this.setParent = (...a) => this._oglTransform.setParent(...a);

    this.addChild = (...a) => this._oglTransform.addChild(...a);

    this.removeChild = (...a) => this._oglTransform.removeChild(...a);

    this.updateMatrixWorld = (...a) => this._oglTransform.updateMatrixWorld(...a);

    this.updateMatrix = (...a) => this._oglTransform.updateMatrix(...a);

    this.traverse = (...a) => this._oglTransform.traverse(...a);

    this.decompose = (...a) => this._oglTransform.decompose(...a);

    this.lookAt = (...a) => this._oglTransform.lookAt(...a);
  }

}