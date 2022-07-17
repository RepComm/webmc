interface ComponentForCallback {
    (self: Component, index: number): void;
}
interface RegisteredEvent {
    callback: EventListener;
    type: string;
}
/**Can be extended to create templates, or used for making
 * writting HTML less painful
 *
 * @author Jonathan Crowder
 */
export default class Component {
    element: HTMLElement | undefined;
    private eventListeners;
    constructor();
    /**Mounts the component to a parent HTML element*/
    mount(parent: Component | HTMLElement): this;
    unmount(): this;
    /**Mounts child component or html element to this*/
    mountChild(child: Component | HTMLElement): this;
    /**Listen to events on this componenet's element*/
    on(type: string, callback: EventListener, options?: any): this;
    getRegisteredEvents(type: string, cb: EventListener): RegisteredEvent[];
    deleteRegisteredEvents(type: string, cb: EventListener): this;
    /**Stop listening to an event on this componenet's element*/
    off(type: string, callback: EventListener): this;
    setId(str?: string): this;
    getId(): string;
    /**Add CSS classes*/
    addClasses(...classnames: string[]): this;
    /**Remove CSS classes*/
    removeClasses(...classnames: string[]): this;
    removeAllListeners(): this;
    static assignComponentToNative(native: HTMLElement, component: Component): void;
    static removeComponentFromNative(native: HTMLElement): void;
    /**Make the element of this component a type of HTMLElement*/
    make(type: string): this;
    /**Use a native element instead of creating one*/
    useNative(element: HTMLElement): this;
    getNative(): HTMLElement;
    setTextContent(str: string): this;
    getTextContent(): string;
    /**Alias of getBoundingClientRect */
    get rect(): DOMRect;
    getRect(): DOMRect;
    /**Removes children components*/
    removeChildren(): this;
    click(): void;
    setStyleItem(item: string, value: any): this;
    getStyleItem(item: string): any;
    /**Experimental*/
    for(start: number, count: number, cb: ComponentForCallback): this;
    /**Set attribute*/
    setAttr(name: string, value: any): this;
    getAttr(name: string): any;
    removeAttr(name: string): this;
    static nativeIsComponent(element: HTMLElement): boolean;
    static nativeToComponent(element: HTMLElement): Component;
}
export {};
