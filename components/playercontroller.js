import { WorldComponent } from "./worldcomponent.js";
import { Player } from "./player.js";
import { GameInput } from "@repcomm/gameinput-ts";
export class PlayerController extends WorldComponent {
  constructor() {
    super();
    this.player = this.getComponent(Player.name);
    let input = GameInput.get();
    input.getOrCreateAxis("forward").addInfluence({
      value: 1,
      keys: ["w"]
    }).addInfluence({
      value: -1,
      keys: ["s"]
    });
    input.getOrCreateAxis("strafe").addInfluence({
      value: 1,
      keys: ["d"]
    }).addInfluence({
      value: -1,
      keys: ["a"]
    });

    this.onUpdate = () => {
      console.log("player controller update");
      let fwd = input.getAxisValue("forward");
      let strafe = input.getAxisValue("strafe");
      this.transform.position.x += strafe;
      this.transform.position.z += fwd;
    };
  }

}