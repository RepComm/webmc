import Component from "./component.js";
/**Base component for exponent library
 * 
 */

export class Exponent extends Component {
  /**Doesn't have to be used by class extensions*/
  constructor() {
    super();
    this.mutObserver = new MutationObserver(this.onElementMutate);
    this.enabled = true;
  }

  getEnabled() {
    return this.enabled;
  }

  setEnabled(enable) {
    if (this.getEnabled() == enable) return this;
    this.enabled = enable;
    this.onEnable();
  }

  onEnable() {}

  make(type) {
    super.make(type);
    this.notifyElementChanged();
    this.applyRootClasses();
    return this;
  }
  /**Called by mutation observer
   * @param recs
   * @param observer 
   */


  onElementMutate(recs, observer) {
    for (let rec of recs) {
      if (rec.type !== "childList") continue; // rec.addedNodes
      // rec.removedNodes
    }
  }
  /**Let the Exponent know if its native element has been changed
   * Typically fired when element removed or added to handle mutation observation of dom node
   */


  notifyElementChanged() {
    this.mutObserver.disconnect();

    if (this.element) {
      this.mutObserver.observe(this.element, {
        subtree: false,
        //Don't listen to grandchildren/etc
        childList: true //Do listen to child remove/add

      });
    }

    return this;
  }

  applyRootClasses() {
    this.addClasses("exponent");
    return this;
  }

}