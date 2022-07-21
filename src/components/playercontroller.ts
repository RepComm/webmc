
import { Ray } from "@dimforge/rapier3d-compat";
import { GameInput } from "@repcomm/gameinput-ts";
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { CubeCollider } from "./cubecollider.js";
import { Player } from "./player.js";
import { RigidBody } from "./rigidbody.js";
import { WorldComponent } from "./worldcomponent.js";

export class PlayerController extends WorldComponent {
  player: Player;
  rb: RigidBody;
  col: CubeCollider;

  movement: Vec3;
  speed: number;
  input: GameInput;
  
  isOnGround: boolean;
  ray: Ray;
  jumpForce: number;
  timeLastJump: number;
  timeWaitJump: number;

  constructor () {
    super();
    this.movement = new Vec3();
    this.speed = 4;
    this.input = GameInput.get();

    this.jumpForce = 7;
    this.isOnGround = false;
    this.timeLastJump = 0;
    this.timeWaitJump = 400;

    this.ray = new Ray({ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: -1.0, z: 0.0 });

    this.onUpdate = ()=>{
      if (this.rb) {
        let fwd = this.input.getAxisValue("forward");
        let strafe = this.input.getAxisValue("strafe");
        
        this.movement.x = strafe;
        this.movement.z = fwd;
        this.movement.y = 0.0;
        this.movement.normalize();
        this.movement.multiply(this.speed);
        
        this.rb.applyImpulse(this.movement, true);
        
        if (this.canJump()) this.jump();
      }
    };
  }
  jump () {
    this.movement.x = 0;
    this.movement.z = 0;
    this.movement.y = 1;
    // this.movement.normalize();
    this.movement.multiply(this.jumpForce);

    this.rb.applyImpulse(this.movement, true);
  }
  canJump (): boolean {
    return (
      this.input.getAxisValue("jump") > 0.5 &&
      Date.now() - this.timeLastJump > this.timeWaitJump &&
      this.detectNearGround()
    );
  }
  detectNearGround (): boolean {
    let {x, y, z} = this.transform.position;
    this.ray.origin.x = x;
    this.ray.origin.y = y + 0.1;
    this.ray.origin.z = z;
    // this.ray.dir
    return Globals._rapierWorld.castRay(
      this.ray, 1, true,
      undefined, undefined, undefined,
      this.rb._rapierRigidBody
    ) !== null;
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
