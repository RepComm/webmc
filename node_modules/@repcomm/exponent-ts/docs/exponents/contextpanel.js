import { Panel } from "./panel.js";
import Component from "../component.js";
/**This panel type can keep track of different components to be rendered
 * and simply uses strings to refer to them
 * 
 * Switching between game renderer / settings panel / menus were in mind for this
 * @author Jonathan Crowder
 * 
 */

export class ContextPanel extends Panel {
  constructor() {
    super();
    this.contexts = new Map();
    this.memory = new Array();
  }

  addContext(id, ctx) {
    this.contexts.set(id, ctx);
    return this;
  }

  hasContext(id) {
    return this.contexts.has(id);
  }

  getContext(id) {
    return this.contexts.get(id);
  }

  getCurrentContext() {
    return this.currentContext;
  }

  getCurrentContextId() {
    return this.currentContextId;
  }

  hasCurrentContext() {
    return this.currentContext && this.currentContext instanceof Component;
  }

  switchContext(id) {
    if (!id) throw `id was ${id}`;
    if (!this.hasContext(id)) throw `Cannot switch context to ${id} as it hasn't been added before`;
    if (this.currentContext) this.currentContext.unmount();
    this.currentContext = this.contexts.get(id);
    if (!this.currentContext) throw `set context, it is ${this.currentContext}`;
    if (!(this.currentContext instanceof Component)) throw `${id} context isn't instance of Component`;
    this.currentContext.mount(this);
    this.currentContext.setStyleItem("flex", 1);
    this.currentContextId = id;
    return this;
  }

  getIds() {
    let result = new Array();

    for (let key of this.contexts.keys()) {
      result.push(key);
    }

    return result;
  }

  save() {
    if (this.currentContext && this.currentContextId) {
      this.memory.push(this.currentContextId);
    } else {
      throw `Couldn't push ${this.currentContextId} into memory`;
    }

    return this;
  }

  restore() {
    if (this.memory.length < 1) throw "Couldn't restore as memory is < 1, forgot to save() ?";
    let id = this.memory.pop();
    if (id === undefined || id === null) throw `id was ${id}`;
    if (!this.hasContext(id)) throw `No component for context id ${id} has been added, cannot restore to it`;
    this.switchContext(id);
    return this;
  }

}