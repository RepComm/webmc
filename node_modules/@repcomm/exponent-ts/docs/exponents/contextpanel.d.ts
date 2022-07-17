import { Panel } from "./panel.js";
import Component from "../component.js";
/**This panel type can keep track of different components to be rendered
 * and simply uses strings to refer to them
 *
 * Switching between game renderer / settings panel / menus were in mind for this
 * @author Jonathan Crowder
 *
 */
export declare class ContextPanel extends Panel {
    private contexts;
    currentContext: Component;
    currentContextId: string;
    memory: Array<string>;
    constructor();
    addContext(id: string, ctx: Component): this;
    hasContext(id: string): boolean;
    getContext(id: string): Component;
    getCurrentContext(): Component;
    getCurrentContextId(): string;
    hasCurrentContext(): boolean;
    switchContext(id: string): this;
    getIds(): Array<string>;
    save(): this;
    restore(): this;
}
