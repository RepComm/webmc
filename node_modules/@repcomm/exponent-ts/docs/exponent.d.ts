import Component from "./component.js";
/**Base component for exponent library
 *
 */
export declare class Exponent extends Component {
    mutObserver: MutationObserver;
    /**Doesn't have to be used by class extensions*/
    enabled: boolean;
    constructor();
    getEnabled(): boolean;
    setEnabled(enable: boolean): this;
    onEnable(): void;
    make(type: string): this;
    /**Called by mutation observer
     * @param recs
     * @param observer
     */
    onElementMutate(recs: Array<MutationRecord>, observer: MutationObserver): void;
    /**Let the Exponent know if its native element has been changed
     * Typically fired when element removed or added to handle mutation observation of dom node
     */
    notifyElementChanged(): this;
    applyRootClasses(): this;
}
