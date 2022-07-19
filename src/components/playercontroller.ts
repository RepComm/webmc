
import { WorldComponent } from "./worldcomponent.js";
import { Player } from "./player.js";
import { GameInput } from "@repcomm/gameinput-ts";
import { RigidBody } from "./rigidbody.js";
import { Vec3 } from "ogl-typescript";
import { CubeCollider } from "./cubecollider.js";

export class PlayerController extends WorldComponent {
  player: Player;
  rb: RigidBody;
  col: CubeCollider;

  movement: Vec3;
  speed: number;
  jumpForce: number;
  input: GameInput;

  constructor () {
    super();
    this.movement = new Vec3();
    this.speed = 15;
    this.jumpForce = 40;
    this.input = GameInput.get();

    this.onUpdate = ()=>{
      if (this.rb) {
        let fwd = this.input.getAxisValue("forward");
        let strafe = this.input.getAxisValue("strafe");

        let jump = this.input.getAxisValue("jump");

        this.movement.x = strafe;
        this.movement.z = fwd;
        this.movement.y = 0.0;
        this.movement.normalize();
        this.movement.multiply(this.speed);

        this.rb.applyImpulse(this.movement, true);

        this.movement.x = 0;
        this.movement.z = 0;
        this.movement.y = jump;
        this.movement.normalize();
        this.movement.multiply(this.jumpForce);

        this.rb.applyImpulse(this.movement, true);
        
      }
    };
  }
  onAttach(): void {
    this.player = this.getComponent(Player);

    this.transform.position.y = 10;

    this.rb = this.getOrCreateComponent(RigidBody);
    this.rb.setLinearDamping(2);
    this.col = this.getOrCreateComponent(CubeCollider);
    
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

    this.input.getOrCreateAxis("jump")
    .addInfluence({
      value: 1,
      keys: [" "]
    });
  }
}
