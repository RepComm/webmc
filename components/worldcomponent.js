import { Component } from "../ecs.js";

/**
 * Basically Component, but defines 'transform' and 'entity'
 * since they will be available on WorldEntitys
 */
export class WorldComponent extends Component {
  get entity() {
    return this._entity;
  }

  get transform() {
    return this.entity.transform;
  }

  constructor() {
    super();
  }

}