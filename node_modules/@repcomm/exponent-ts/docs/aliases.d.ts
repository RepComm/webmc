/**Get an element by its ID, alias
 */
declare const get: (id: string) => HTMLElement | undefined;
/**Alias for getElementsByClassName*/
declare const getByClass: (classname: string) => HTMLCollectionOf<Element>;
/**An alias for getBoundingClientRect*/
declare const rect: (e: HTMLElement) => DOMRect;
/**Alias for createElement*/
declare const make: (type: string) => HTMLElement;
/**Listen to events on an element*/
declare const on: (elem: HTMLElement | Window, type: string, callback: EventListener | any, options?: any | undefined) => void;
/**Stop listen to events on an element*/
declare const off: (elem: HTMLElement | Window, type: string, callback: EventListener) => void;
/**Remove all child elements from an element*/
declare const clearChildren: (e: HTMLElement) => void;
/**Apply classes to an element*/
declare const applyStyleClasses: (e: HTMLElement, ...classes: string[]) => void;
export { get, getByClass, rect, make, on, off, clearChildren, applyStyleClasses };
