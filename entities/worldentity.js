import { ESC_COMPONENT_NAMESPACE, Transform } from "../components/transform.js";
import { Entity } from "../ecs.js";
export class WorldEntity extends Entity {
  /**A helpful label/name, not usually rendered by anything*/

  /**Each WorldEntity has a transform component, this is a convenient accessor to it*/

  /**
   * Get the parent WorldEntity (if any, note: this does not include raw ogl Transforms)
   */
  get parent() {
    let p = this.transform.getParent();
    if (p) return p.entity;
    return null;
  }

  constructor(label) {
    super();
    this.setLabel(label);
    this.transform = new Transform();
    this.addComponent(this.transform);
  }

  setLabel(label) {
    this.label = label || "unlabelled";
    return this;
  }

  setParent(t) {
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


  getChildren() {
    let result = [];
    let component;

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


  traverse(cb, depth = 0, maxDepth = 10) {
    cb(this, depth);
    let children = this.getChildren();

    for (let child of children) {
      // cb(child+1, depth);
      child.traverse(cb, depth + 1, maxDepth);
    }
  }

  onUpdate() {
    super.onUpdate();
    let component;

    for (let child of this.transform.children) {
      component = child[ESC_COMPONENT_NAMESPACE];

      if (component && component.entity) {
        component.entity.onUpdate();
      }
    }
  }

}