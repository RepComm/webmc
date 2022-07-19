import { WorldComponent } from "./worldcomponent.js";
export let CollisionCheck;

(function (CollisionCheck) {
  CollisionCheck[CollisionCheck["NO_COLLISION"] = 0] = "NO_COLLISION";
  CollisionCheck[CollisionCheck["NO_DEFER"] = 1] = "NO_DEFER";
  CollisionCheck[CollisionCheck["YES_COLLISION"] = 2] = "YES_COLLISION";
})(CollisionCheck || (CollisionCheck = {}));

export class Collider extends WorldComponent {
  constructor() {
    super();
  }

  onDeactivate() {
    Collider.all.delete(this);
  }

  onReactivate() {
    Collider.all.add(this);
  }

  onAttach() {
    Collider.all.add(this);
  }

  onDetach() {
    Collider.all.delete(this);
  }

  static collisionCheckAll() {
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


  collisionCheck(b, info) {
    return CollisionCheck.NO_DEFER;
  }

}
Collider.all = new Set();
Collider.collisionInfo = {};