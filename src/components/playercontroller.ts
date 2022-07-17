
import { WorldComponent } from "./worldcomponent.js";
import { Player } from "./player.js";
import { GameInput } from "@repcomm/gameinput-ts";
import { RigidBody } from "./rigidbody.js";
import { Vec3 } from "ogl-typescript";

export class PlayerController extends WorldComponent {
  player: Player;
  rb: RigidBody;
  movement: Vec3;
  nVelocity: Vec3;
  speed: number;
  input: GameInput;

  constructor () {
    super();
    this.movement = new Vec3();
    this.nVelocity = new Vec3();
    this.speed = 0.01;
    this.input = GameInput.get();

    this.onUpdate = ()=>{
      let fwd = this.input.getAxisValue("forward");
      let strafe = this.input.getAxisValue("strafe");

      this.nVelocity.copy(this.rb.velocity).multiply(-0.25);

      this.movement.x = strafe;
      this.movement.z = fwd;
      this.movement.normalize();
      this.movement.multiply(this.speed);
      this.movement.add(this.nVelocity);

      if (this.rb) this.rb.addForce(this.movement);
    };
  }
  onAttach(): void {
    this.player = this.getComponent(Player);

    this.rb = this.getOrCreateComponent(RigidBody);
    
    this.input.getOrCreateAxis("forward")
    .addInfluence({
      value: -1,
      keys: ["w"]
    })
    .addInfluence({
      value: 1,
      keys: ["s"]
    });
    this.input.getOrCreateAxis("strafe")
    .addInfluence({
      value: 1,
      keys: ["d"]
    })
    .addInfluence({
      value: -1,
      keys: ["a"]
    });
  }
}
