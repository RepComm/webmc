
import { Component, Entity } from "../ecs.js";
import { WorldEntity } from "../entities/worldentity.js";
import { Transform } from "./transform.js";

/**
 * Basically Component, but defines 'transform' and 'entity'
 * since they will be available on WorldEntitys
 */
export class WorldComponent extends Component {
  protected _entity: WorldEntity;
  get entity (): WorldEntity {
    return this._entity;
  }
  get transform (): Transform {
    return this.entity.transform;
  }
  constructor () {
    super();

  }
}
