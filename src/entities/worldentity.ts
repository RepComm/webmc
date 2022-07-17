
import { ESC_COMPONENT_NAMESPACE, Transform } from "../components/transform.js";
import { Entity } from "../ecs.js";

export interface WorldEntityTraverse {
  (child: WorldEntity, depth: number): void;
}

export class WorldEntity extends Entity {
  label: string;
  transform: Transform;
  isWorldEntity: boolean;

  get parent(): WorldEntity {
    return this.transform.getParent().entity;
  }
  constructor(label?: string) {
    super();
    this.label = label||"unlabelled";

    this.isWorldEntity = true;
    this.transform = new Transform();
    this.addComponent(this.transform);
  }
  setParent(t: Transform | WorldEntity): this {
    if (t instanceof WorldEntity) {
      this.transform.setParent(t.transform);
    } else {
      this.transform.setParent(t);
    }
    return this;
  }
  getChildren(): Array<WorldEntity> | null {
    let result: Array<WorldEntity> = [];
    let component: Transform;

    for (let child of this.transform.children) {
      component = child[ESC_COMPONENT_NAMESPACE];
      if (component && component.entity) result.push(component.entity);
    }
    return result || null;
  }
  traverse(cb: WorldEntityTraverse, depth: number = 0, maxDepth: number = 10) {
    let children = this.getChildren();
    for (let child of children) {
      cb(child, depth);
      child.traverse(cb, depth+1, maxDepth);
    }
  }
}
