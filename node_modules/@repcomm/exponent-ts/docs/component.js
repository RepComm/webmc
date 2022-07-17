import { on, off, make, rect } from "./aliases.js"; //TODO - replace with harrix event listener api

const COMPONENT_NAMESPACE = "component-namespace";

/**Can be extended to create templates, or used for making
 * writting HTML less painful
 * 
 * @author Jonathan Crowder
 */
export default class Component {
  constructor() {
    this.eventListeners = new Array();
  }
  /**Mounts the component to a parent HTML element*/


  mount(parent) {
    if (parent instanceof HTMLElement) {
      parent.appendChild(this.element);
    } else if (parent instanceof Component) {
      // parent.mountChild(this);
      parent.element.appendChild(this.element);
    } else {
      throw "Cannot append to parent because its not a Component or HTMLElement";
    }

    return this;
  }

  unmount() {
    if (this.element.parentElement) {
      this.element.remove();
    }

    return this;
  }
  /**Mounts child component or html element to this*/


  mountChild(child) {
    if (child instanceof HTMLElement) {
      this.element.appendChild(child);
    } else if (child instanceof Component) {
      // this.element.appendChild(child.element);
      child.mount(this);
    } else {
      throw "Cannot append child because its not a Component or HTMLElement";
    }

    return this;
  }
  /**Listen to events on this componenet's element*/


  on(type, callback, options) {
    on(this.element, type, callback, options);
    this.eventListeners.push({
      type,
      callback
    });
    return this;
  }

  getRegisteredEvents(type, cb) {
    let result = new Array();

    for (let listener of this.eventListeners) {
      if (listener.type == type && listener.callback == cb) {
        result.push(listener);
      }
    }

    return result;
  }

  deleteRegisteredEvents(type, cb) {
    let listener;

    for (let i = 0; i < this.eventListeners.length; i++) {
      listener = this.eventListeners[i];

      if (type == listener.type && cb == listener.callback) {
        this.eventListeners.splice(i, 1);
      }
    }

    return this;
  }
  /**Stop listening to an event on this componenet's element*/


  off(type, callback) {
    off(this.element, type, callback);
    this.deleteRegisteredEvents(type, callback);
    return this;
  }

  setId(str) {
    this.element.id = str;
    return this;
  }

  getId() {
    return this.element.id;
  }
  /**Add CSS classes*/


  addClasses(...classnames) {
    this.element.classList.add(...classnames);
    return this;
  }
  /**Remove CSS classes*/


  removeClasses(...classnames) {
    this.element.classList.remove(...classnames);
    return this;
  }

  removeAllListeners() {
    for (let listener of this.eventListeners) {
      this.off(listener.type, listener.callback);
    }

    return this;
  }

  static assignComponentToNative(native, component) {
    native[COMPONENT_NAMESPACE] = {
      component: component
    };
  }

  static removeComponentFromNative(native) {
    native[COMPONENT_NAMESPACE] = undefined;
  }
  /**Make the element of this component a type of HTMLElement*/


  make(type) {
    if (this.element) {
      this.removeAllListeners();
      Component.removeComponentFromNative(this.element);
    }

    this.element = make(type);
    Component.assignComponentToNative(this.element, this);
    return this;
  }
  /**Use a native element instead of creating one*/


  useNative(element) {
    if (this.element) {
      this.removeAllListeners();
      Component.removeComponentFromNative(this.element);
    }

    if (!element) console.warn("useNative was passed", element);
    this.element = element;
    return this;
  }

  getNative() {
    return this.element;
  }

  setTextContent(str) {
    this.element.textContent = str;
    return this;
  }

  getTextContent() {
    return this.element.textContent;
  }
  /**Alias of getBoundingClientRect */


  get rect() {
    return this.getRect();
  }

  getRect() {
    return rect(this.element);
  }
  /**Removes children components*/


  removeChildren() {
    while (this.element.lastChild) {
      this.element.lastChild.remove();
    }

    return this;
  }

  click() {
    this.element.click();
  }

  setStyleItem(item, value) {
    this.element.style[item] = value;
    return this;
  }

  getStyleItem(item) {
    return this.element.style[item];
  }
  /**Experimental*/


  for(start, count, cb) {
    for (let i = start; i < count + 1; i++) {
      cb(this, i);
    }

    return this;
  }
  /**Set attribute*/


  setAttr(name, value) {
    this.element[name] = value;
    return this;
  }

  getAttr(name) {
    return this.element[name];
  }

  removeAttr(name) {
    this.element.removeAttribute(name);
    return this;
  }

  static nativeIsComponent(element) {
    return element[COMPONENT_NAMESPACE] != undefined && element[COMPONENT_NAMESPACE] != null;
  }

  static nativeToComponent(element) {
    if (!Component.nativeIsComponent(element)) throw `No component found in native ${element}`;
    return element[COMPONENT_NAMESPACE].component;
  }

}