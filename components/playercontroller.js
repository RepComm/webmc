import { Ray } from "@dimforge/rapier3d-compat";
import { GameInput } from "@repcomm/gameinput-ts";
import { Vec3 } from "ogl-typescript";
import { Globals } from "../utils/global.js";
import { SphereCollider } from "./spherecollider.js";
import { Player } from "./player.js";
import { RigidBody } from "./rigidbody.js";
import { WorldComponent } from "./worldcomponent.js";
export class PlayerController extends WorldComponent {
  constructor() {
    super();
    this.movement = new Vec3();
    this.speed = 1;
    this.lookSensitivity = 0.001;
    this.input = GameInput.get();
    this.jumpForce = 10;
    this.isOnGround = false;
    this.timeLastJump = 0;
    this.timeWaitJump = 400;
    this.ray = new Ray({
      x: 0.0,
      y: 0.0,
      z: 0.0
    }, {
      x: 0.0,
      y: -1.0,
      z: 0.0
    });

    this.onUpdate = () => {
      if (this.rb) {
        if (this.input.raw.pointerIsLocked()) {
          let rx = this.input.builtinMovementConsumer.getDeltaX();
          let ry = this.input.builtinMovementConsumer.getDeltaY();
          this.cameraAttachPoint.transform.rotation.x -= ry * this.lookSensitivity;
          this.entity.transform.rotation.y -= rx * this.lookSensitivity; // this.cameraAttachPoint.transform.rotation.y -= rx * this.lookSensitivity;
        } else {
          if (this.input.raw.getPointerButton(0)) {
            this.input.raw.pointerTryLock(Globals.gl.canvas);
          }
        }

        let fwd = this.input.getAxisValue("forward");
        let strafe = this.input.getAxisValue("strafe");

        if (Math.abs(fwd) < 0.5 && Math.abs(strafe) < 0.5) {
          this.movement.z = -this.rb.velocity.z * 0.1;
          this.movement.x = -this.rb.velocity.x * 0.1;
          this.rb.applyImpulse(this.movement);
        }

        this.movement.set(strafe, 0, fwd).applyQuaternion(this.entity.transform.quaternion).normalize() // .multiply(fwd)
        .multiply(this.speed); // this.movement.x = strafe;
        // this.movement.z = fwd;
        // this.movement.y = 0.0;
        // this.movement.normalize();
        // this.movement.multiply(this.speed);

        this.rb.applyImpulse(this.movement, true);
        if (this.canJump()) this.jump();
      }
    };
  }

  jump() {
    this.timeLastJump = Date.now();
    this.movement.x = 0;
    this.movement.z = 0;
    this.movement.y = 1; // this.movement.normalize();

    this.movement.multiply(this.jumpForce);
    this.rb.applyImpulse(this.movement, true);
  }

  canJump() {
    return this.input.getAxisValue("jump") > 0.5 && Date.now() - this.timeLastJump > this.timeWaitJump && this.detectNearGround();
  }

  detectNearGround() {
    let {
      x,
      y,
      z
    } = this.transform.position;
    this.ray.origin.x = x;
    this.ray.origin.y = y + 0.1;
    this.ray.origin.z = z; // this.ray.dir

    return Globals._rapierWorld.castRay(this.ray, 1.5, true, undefined, undefined, undefined, this.rb._rapierRigidBody) !== null;
  }

  onAttach() {
    this.cameraAttachPoint = this.entity.getOrCreateChildByLabel("cameraAttachPoint");
    this.player = this.getComponent(Player); //playercontroller is added by Player, so Player should exist. otherwise error

    this.transform.position.y = 10;
    this.rb = this.getOrCreateComponent(RigidBody).setEnabledRotations(false, false, false, true).setLinearDamping(1);
    this.col = new SphereCollider(0.4);
    this.entity.addComponent(this.col);
    this.col.setFriction(0);
    this.input.getOrCreateAxis("forward").addInfluence({
      value: -1,
      keys: ["w"]
    }).addInfluence({
      value: 1,
      keys: ["s"]
    });
    this.input.getOrCreateAxis("strafe").addInfluence({
      value: 1,
      keys: ["d"]
    }).addInfluence({
      value: -1,
      keys: ["a"]
    });
    this.input.getOrCreateAxis("jump").addInfluence({
      value: 1,
      keys: [" "]
    });
  }

}