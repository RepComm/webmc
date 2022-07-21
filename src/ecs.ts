
/**
 * Base class for all components attached to entities
 * 
 */
export class Component {
  protected _entity: Entity;
  protected _active: boolean;
  get active (): boolean {
    return this._active;
  }
  setActive (active: boolean): this {
    let previousValue = this._active;
    this._active = (active === true);
    if (this._active !== previousValue) {
      if (this._active) this.onReactivate();
      else this.onDeactivate();
    }
    return this;
  }
  /**
   * Get the entity this component is attached to
   */
  get entity (): Entity {
    return this._entity;
  }
  /**
   * Detect if component is attached to an entity
   * Realistically, your code should not be running when this is false
   */
  get isAttached (): boolean {
    return this._entity !== undefined && this._entity !== null;
  }
  /**
   * make sure to call super() in your subclass
   */
  constructor () {
    this._active = true;
  }
  /**
   * Get notified when the component is attached to an entity
   * This happens right after attachment, so this.entity is valid
   */
  onAttach () {

  }
  /**
   * Get notified when the component is detached from an entity
   * This happens right before detachment, so this.entity is still valid
   */
  onDetach () {

  }
  /**
   * Components start out active, this method is only called after
   * deactivating and then reactivating it
   */
  onReactivate () {

  }
  onDeactivate () {

  }
  onUpdate: ()=>void;
  onMessage: (c: Component, msg: any)=>void;
  /**Send a message that can be heard from other components on the same entity
   * Returns false if no entity attached, and true otherwise
  */
  sendMessage (msg: any): boolean {
    if (!this._entity) return false;
    this.entity.onMessage(this, msg);
    return true;
  }

  /**
   * Get a sibling component given the constructor of the component or its name
   * 
   * Ex:
   * ```ts
   * import {Transform} from "./components/transform.js";
   * //...
   * this.getComponent(Transform.name);
   * 
   * //or
   * this.getComponent("Transform");
   * 
   * //or
   * this.getComponent(Transform);
   * 
   * //or given an instance of the object
   * this.getComponent(someInstance.constructor);
   * ```
   */
  getComponent<T> (constructor: new ()=> T|string): T|null {
    if (!this.isAttached) return null;
    return this.entity.getComponent(constructor);
  }
  getOrCreateComponent<T>(c: new ()=> T): T {
    if (!this.isAttached) return null;
    return this.entity.getOrCreateComponent(c);
  }
}

export type Components = Array<Component>;

export class Entity {
  private _components: Components;
  get components (): Components {
    if (!this._components) this._components = new Array();
    return this._components;
  }

  constructor () {

  }
  addComponent (c: Component): this {
    if (this.onComponentBeforeAdd(c) === false) return this;

    this.components.push(c);
    c["_entity"] = this;
    
    this.onComponentAdd(c);
    c.onAttach();

    return this;
  }
  hasComponent (c: Component): boolean { 
    return this._components.includes(c);
  }
  removeComponent(c: Component): this {
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
  getComponents (constructor: Function|string): Array<Component>|null {
    let result = [];
    if (this._components) {
      if (typeof (constructor) === "string") {
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
  /**
   * Get a sibling component given the constructor of the component or its name
   * 
   * Ex:
   * ```ts
   * import {Transform} from "./components/transform.js";
   * //...
   * this.getComponent(Transform.name);
   * 
   * //or
   * this.getComponent("Transform");
   * 
   * //or
   * this.getComponent(Transform);
   * 
   * //or given an instance of the object
   * this.getComponent(someInstance.constructor);
   * ```
   */
  getComponent <T> (constructor: new ()=> T|string): T|null {
    
    if (!this._components) return null;
    if (typeof (constructor) === "string") {
      for (let c of this.components) {
        //@ts-expect-error
        if (c.constructor.name === constructor) return c;
      }
    } else {
      for (let c of this.components) {
        //@ts-expect-error
        if (c.constructor === constructor) return c;
      }
    }
    
    return null;

  }
  onComponentAdd (c: Component) {
    
  }
  onComponentRemove (c: Component) {
    
  }
  /**
   * Meant to be implemented on subclasses
   * 
   * Use this to deny adding of components if desired
   * 
   * Return true or undefined to do nothing (let component be added), false to reject
   */
  onComponentBeforeAdd (c: Component): boolean|undefined {
    return true;
  }
  /**
   * Meant to be implemented on subclasses
   * 
   * Use this to deny removal of components if desired
   * 
   * Return true or undefined to do nothing (let component be removed), false to reject
   */
  onComponentBeforeRemove (c: Component): boolean|undefined {
    return true;
  }
  onUpdate () {
    if (!this._components) return;
    for (let c of this.components) {
      if (c.active && c.onUpdate) c.onUpdate();
    }
  }
  getOrCreateComponent<T>(c: new ()=> T): T {
    let result = this.getComponent(c);
    if (!result) {
      result = new c.prototype.constructor();
      //@ts-expect-error
      this.addComponent(result);
    }
    return result;
  }
  onMessage(c: Component, msg: any): void {
    if (!this._components) return;
    for (let c of this.components) {
      if (c.active && c.onMessage) c.onMessage(c, msg);
    }
  }
}
