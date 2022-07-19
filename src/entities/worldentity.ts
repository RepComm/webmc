
import { ESC_COMPONENT_NAMESPACE, Transform } from "../components/transform.js";
import { Entity } from "../ecs.js";

export interface WorldEntityTraverse {
  (child: WorldEntity, depth: number): void;
}

export class WorldEntity extends Entity {
  /**A helpful label/name, not usually rendered by anything*/
  label: string;
  /**Each WorldEntity has a transform component, this is a convenient accessor to it*/
  transform: Transform;
  
  /**
   * Get the parent WorldEntity (if any, note: this does not include raw ogl Transforms)
   */
  get parent(): WorldEntity {
    let p = this.transform.getParent();
    if (p) return p.entity;
    return null;
  }
  constructor(label?: string) {
    super();
    this.setLabel(label);

    this.transform = new Transform();
    this.addComponent(this.transform);
  }
  setLabel (label?: string): this {
    this.label = label || "unlabelled";
    return this;
  }
  setParent(t: Transform | WorldEntity): this {
    if (t instanceof WorldEntity) {
      this.transform.setParent(t.transform);
    } else {
      this.transform.setParent(t);
    }
    return this;
  }
  /**
   * Get immediate WorldEntity children (does not include raw ogl Transforms)
   */
  getChildren(): Array<WorldEntity> | null {
    let result: Array<WorldEntity> = [];
    let component: Transform;

    for (let child of this.transform.children) {
      component = child[ESC_COMPONENT_NAMESPACE];
      if (component && component.entity) result.push(component.entity);
    }
    return result || null;
  }
  /**
   * Walk thru the scenegraph of WorldEntitys
   * 
   * Does not include raw ogl transforms
   */
  traverse(cb: WorldEntityTraverse, depth: number = 0, maxDepth: number = 10) {
    cb(this, depth);

    let children = this.getChildren();
    for (let child of children) {
      // cb(child+1, depth);
      child.traverse(cb, depth+1, maxDepth);
    }
  }
  onUpdate () {
    super.onUpdate();
    let component: Transform;

    for (let child of this.transform.children) {
      component = child[ESC_COMPONENT_NAMESPACE];
      if (component && component.entity) {
        component.entity.onUpdate();
      }
    }

  }
}
