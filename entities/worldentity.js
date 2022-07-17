import { ESC_COMPONENT_NAMESPACE, Transform } from "../components/transform.js";
import { Entity } from "../ecs.js";
export class WorldEntity extends Entity {
  get parent() {
    return this.transform.getParent().entity;
  }

  constructor(label) {
    super();
    this.label = label || "unlabelled";
    this.isWorldEntity = true;
    this.transform = new Transform();
    this.addComponent(this.transform);
  }

  setParent(t) {
    if (t instanceof WorldEntity) {
      this.transform.setParent(t.transform);
    } else {
      this.transform.setParent(t);
    }

    return this;
  }

  getChildren() {
    let result = [];
    let component;

    for (let child of this.transform.children) {
      component = child[ESC_COMPONENT_NAMESPACE];
      if (component && component.entity) result.push(component.entity);
    }

    return result || null;
  }

  traverse(cb, depth = 0, maxDepth = 10) {
    cb(this, depth);
    let children = this.getChildren();

    for (let child of children) {
      // cb(child+1, depth);
      child.traverse(cb, depth + 1, maxDepth);
    }
  }

}