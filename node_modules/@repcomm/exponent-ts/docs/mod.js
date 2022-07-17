import { applyStyleClasses, clearChildren, get, getByClass, make, off, on, rect } from "./aliases.js";
import Component from "./component.js";
import { Exponent } from "./exponent.js";
import { Button } from "./exponents/button.js";
import { ContextPanel } from "./exponents/contextpanel.js";
import { Drawing } from "./exponents/drawing.js";
import { DualPanel } from "./exponents/dualpanel.js";
import { Grid } from "./exponents/grid.js";
import { ImagePanel } from "./exponents/imagepanel.js";
import { Input } from "./exponents/input.js";
import { Knob } from "./exponents/knob.js";
import { ListPanel } from "./exponents/listpanel.js";
import { Panel } from "./exponents/panel.js";
import { SquarePanel } from "./exponents/squarepanel.js";
import { Style } from "./exponents/style.js";
import { Text } from "./exponents/text.js";
/**Sensible defaults for all exponent class elements*/

export const EXPONENT_CSS_STYLES = new Style().setId("exponent-built-in-styles").setTextContent(`
  .exponent {
    flex: 1;
  }
  .exponent-panel {
    display: flex;
  }
  .exponent-dual-panel {
    display: flex;
  }
  .exponent-grid {
    display: grid;
  }
  .exponent-button {
    border: none;
    cursor: pointer;
  }
  .exponent-knob-grab {
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
    cursor: grab;
  }
  .exponent-drawing {
    min-width:0;
  }
  .exponent-square-container {
  }
  .exponent-list {
    flex-wrap: wrap;
    /* overflow:hidden; */
  }
  .exponent-list>* {
    flex: 1;
  }
  .exponent-input {
    min-width: 0;
    min-height: 0;
  }
  .exponent-text {
    color: inherit;
  }
  `);
/**Sensible defaults for the document.body - optional of course*/

export const EXPONENT_CSS_BODY_STYLES = new Style().setId("exponent-built-in-styles-body").setTextContent(`
  body {
    /*needed to make the page fit the window*/
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    
    /**Needed to make the page not offset in the window)*/
    margin: 0;
    padding: 0;
    
    /*needed for proper use of components*/
    display: flex;
  
    /*needed to make the page not scroll from bad default browser css behavior*/
    overflow: hidden;
  }
  `);

function injectEventListenAPI() {
  //TODO - implement into exponents themselves
  //harrix / hb432 implementation of event tracking
  (() => {
    const storage = new Map();
    const {
      addEventListener,
      removeEventListener
    } = EventTarget.prototype;
    Object.defineProperties(EventTarget.prototype, {
      eventListeners: {
        get: function () {
          //@ts-expect-error
          return storage.has(this) ? storage.get(this) : storage.set < Array(this, []).get(this);
        }
      },
      addEventListener: {
        value: function (...args) {
          addEventListener.call(this, ...args);
          this.eventListeners.push(new Set(args));
        }
      },
      removeEventListener: {
        value: function (...args) {
          removeEventListener.call(this, ...args);
          const listeners = this.eventListeners;

          for (const listener of listeners) {
            args.map(arg => listener.has(arg)).includes(false) || listeners.splice(listeners.indexOf(listener), 1);
          }
        }
      }
    });
  })();
  /**example usage, remove all events for the click and hover events from all div elements
   * for (const div of [ ...document.querySelectorAll('div') ]) {
     for (const [ type, ...args ] of div.eventListeners) {
        switch (type) {
           case 'click':
           case 'hover':
              div.removeEventListener(type, ...args);
              break;
        }
     }
    }
   */

}

function runOnce() {
  injectEventListenAPI();
}

export { Exponent, Button, Panel, ContextPanel, DualPanel, Grid, ImagePanel, ListPanel, SquarePanel, Knob, Drawing, Text, Component, Style, Input, runOnce, on, get, applyStyleClasses, clearChildren, getByClass, make, off, rect };