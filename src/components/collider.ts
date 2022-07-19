
import { WorldComponent } from "./worldcomponent.js";

export enum CollisionCheck {
  /**We checked and there is no collision*/
  NO_COLLISION,
  /**We don't have an collision check impl for the other collider, try the other collider's functions*/
  NO_DEFER,
  /**We checked and there is a collision*/
  YES_COLLISION
}

export interface CollisionInfo {
  colliding?: boolean;
}

export class Collider extends WorldComponent {

  static all: Set<Collider>;
  static collisionInfo: CollisionInfo;

  constructor () {
    super();
  }
  onDeactivate(): void {
    Collider.all.delete(this);
  }
  onReactivate(): void {
    Collider.all.add(this);
  }
  onAttach(): void {
    Collider.all.add(this);
  }
  onDetach(): void {
    Collider.all.delete(this);
  }
  static collisionCheckAll () {
    for (let a of Collider.all) {
      for (let b of Collider.all) {
        if (a === b) continue;

        if (a.collisionCheck(b, Collider.collisionInfo) === CollisionCheck.NO_DEFER) {
          b.collisionCheck(a, Collider.collisionInfo);
        }
      }
    }
  }
  /**Meant to be implemented on subclasses of collider
   * @param b the other collider to check against
   * @param info the collision info to be populated by our collision check
   * @returns collision check enum. You can defer to the other collider's collisionCheck method
   * by returning CollisionCheck.NO_DEFER
   */
  collisionCheck (b: Collider, info: CollisionInfo): CollisionCheck {
    return CollisionCheck.NO_DEFER;
  }
}

Collider.all = new Set();
Collider.collisionInfo = {};