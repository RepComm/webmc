/**Get an element by its ID, alias
 */
const get = id => document.getElementById(id);
/**Alias for getElementsByClassName*/


const getByClass = classname => document.getElementsByClassName(classname);
/**An alias for getBoundingClientRect*/


const rect = e => e.getBoundingClientRect();
/**Alias for createElement*/


const make = type => document.createElement(type);
/**Listen to events on an element*/


const on = (elem, type, callback, options = undefined) => {
  if (!elem) throw "No element supplied";
  elem.addEventListener(type, callback, options);
};
/**Stop listen to events on an element*/


const off = (elem, type, callback) => {
  if (!elem) throw "No element supplied";
  elem.removeEventListener(type, callback);
};
/**Remove all child elements from an element*/


const clearChildren = e => {
  while (e.lastChild) {
    e.lastChild.remove();
  }
};
/**Apply classes to an element*/


const applyStyleClasses = (e, ...classes) => {
  if (!classes) return;

  for (const c of classes) {
    e.classList.add(c);
  }
};

export { get, getByClass, rect, make, on, off, clearChildren, applyStyleClasses };