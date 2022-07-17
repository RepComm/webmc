export class Component {
  get entity() {
    return this._entity;
  }

  get isAttached() {
    return this._entity !== undefined && this._entity !== null;
  }

  constructor() {}

  onAttach() {}

  onDetach() {}

  getComponent(constructor) {
    if (!this.isAttached) return null;
    return this.entity.getComponent(constructor);
  }

}
export class Entity {
  get components() {
    if (!this._components) this._components = new Array();
    return this._components;
  }

  constructor() {}

  addComponent(c) {
    if (this.onComponentBeforeAdd(c) === false) return this;
    this.components.push(c);
    c["_entity"] = this;
    this.onComponentAdd(c);
    c.onAttach();
    return this;
  }

  hasComponent(c) {
    return this._components.includes(c);
  }

  removeComponent(c) {
    if (!this._components) return this;
    if (this.onComponentBeforeRemove(c) === false) return this;

    let idx = this._components.indexOf(c);

    if (idx < 0) return this;
    c.onDetach();

    this._components.splice(idx, 1);

    c["_entity"] = undefined;
    this.onComponentRemove(c);
    return this;
  }

  getComponents(constructor) {
    let result = [];

    if (this._components) {
      if (typeof constructor === "string") {
        for (let c of this.components) {
          if (c.constructor.name === constructor) result.push(c);
        }
      } else {
        for (let c of this.components) {
          if (c.constructor === constructor) result.push(c);
        }
      }
    }

    return result || null;
  }

  getComponent(constructor) {
    if (!this._components) return null;

    if (typeof constructor === "string") {
      for (let c of this.components) {
        if (c.constructor.name === constructor) return c;
      }
    } else {
      for (let c of this.components) {
        if (c.constructor === constructor) return c;
      }
    }

    return null;
  }

  onComponentAdd(c) {}

  onComponentRemove(c) {}
  /**
   * Meant to be implemented on subclasses
   * 
   * Use this to deny adding of components if desired
   * 
   * Return true or undefined to do nothing (let component be added), false to reject
   */


  onComponentBeforeAdd(c) {
    return true;
  }
  /**
   * Meant to be implemented on subclasses
   * 
   * Use this to deny removal of components if desired
   * 
   * Return true or undefined to do nothing (let component be removed), false to reject
   */


  onComponentBeforeRemove(c) {
    return true;
  }

}