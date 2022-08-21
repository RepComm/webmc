
import { Quaternion, Ray, RayColliderIntersection, Vector, World } from "@dimforge/rapier3d-compat";
import { GameInput } from "@repcomm/gameinput-ts";
import { Vec3 } from "ogl-typescript";
import { WorldEntity } from "../entities/worldentity.js";
import { Globals } from "../utils/global.js";
import { SphereCollider } from "./spherecollider.js";
import { Player } from "./player.js";
import { RigidBody } from "./rigidbody.js";
import { WorldComponent } from "./worldcomponent.js";
// import { DebugEntity } from "../entities/debugentity.js";
import { Block } from "../voxel/block.js";
import { FlatTexMesh } from "./flattexmesh.js";
import { Vec3Animator } from "../utils/animators.js";
import { Camera } from "./camera.js";
import { lerp, Vec3Add, Vec3ApplyQuaternion, Vec3Copy, Vec3Dist, Vec3Floor, Vec3Lerp, Vec3MulScalar, Vec3Set, Vec3Sub,  } from "../utils/math.js";
import { Timer } from "../utils/timer.js";
import { BoxWire } from "./boxwire.js";

export class PlayerController extends WorldComponent {
  blockIndicator: WorldEntity;

  cameraEntity: WorldEntity
  camera: Camera;

  itemSwingAnim: Vec3Animator;
  itemJogAnim: Vec3Animator;

  player: Player;
  rb: RigidBody;
  col: SphereCollider;

  movement: Vec3;
  speed: number;
  lookSensitivity: number;

  input: GameInput;

  isOnGround: boolean;
  ray: Ray;
  rayHit: RayColliderIntersection | null;
  rayHitPoint: Vector | null;

  jumpForce: number;
  jumpTimer: Timer;
  
  breakTimer: Timer;

  placeTimer: Timer;
  
  block: Block;

  constructor() {
    super();
    this.movement = new Vec3();
    this.speed = 0.8;
    this.lookSensitivity = 0.25;
    this.input = GameInput.get();

    this.jumpForce = 10;
    this.isOnGround = false;

    this.jumpTimer = new Timer(400);

    this.breakTimer = new Timer(200);

    this.placeTimer = new Timer(100);

    this.camera = new Camera();

    this.ray = new Ray({ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: -1.0, z: 0.0 });
    // this.rayHit = undefined;

    this.block = new Block();

    this.itemSwingAnim = new Vec3Animator()
      .createClip({
        durationMillis: 175,
        start: 0,
        end: 1,
        fps: 30,
        loop: false,
        name: "swing"
      })
      .setValueAtTime(0,
        Math.PI, -1, Math.PI
      )
      .setValueAtTime(0.5,
        Math.PI, -1, Math.PI - 1
      )
      .setValueAtTime(1,
        Math.PI, -1, Math.PI
      );

    let jogLeftMost = 0.55;
    let jogRightMost = 0.85;
    let jogTopMost = -0.5;
    let jogBottomMost = jogTopMost-0.2;
    this.itemJogAnim = new Vec3Animator()
      .createClip({
        durationMillis: 700,
        start: 0,
        end: 4,
        fps: 30,
        loop: false,
        name: "jog"
      })
      .setValueAtTime(0,
        jogLeftMost, jogTopMost, -1
      )
      .setValueAtTime(1,
        lerp(jogLeftMost, jogRightMost, 0.5), jogBottomMost, -1
      )
      .setValueAtTime(2,
        jogRightMost, jogTopMost, -1
      )
      .setValueAtTime(3,
        lerp(jogLeftMost, jogRightMost, 0.5), jogBottomMost, -1
      )
      .setValueAtTime(4,
        jogLeftMost, jogTopMost, -1
      );

    this.onUpdate = () => {
      if (!this.rb) return;

      //update whether we're on the ground
      this.detectNearGround();

      if (this.input.raw.pointerIsLocked()) {
        let rx = this.input.getAxisValue("h-look");
        let ry = this.input.getAxisValue("v-look");

        this.cameraEntity.transform.rotation.x -= ry * this.lookSensitivity;
        this.entity.transform.rotation.y -= rx * this.lookSensitivity;
        // this.cameraAttachPoint.transform.rotation.y -= rx * this.lookSensitivity;

        //update what block/entity we are looking at
        // this.detectBlockFocus();
        if (this.detectBlockRaycast()) {

          //move indicator
          this.calcBlockPosition(false);
          Vec3Copy(this.blockIndicator.transform.position, this.block.position);

          //try to break/place
          if (this.canBreak()) this.break();
          else if (this.canPlace()) this.place();
        }
        // Vec3Copy(this.debugEntity.transform.position, this.block.position);

      } else {
        if (this.input.raw.getPointerButton(0)) {
          this.input.raw.pointerTryLock(Globals.gl.canvas);
        }
      }

      let fwd = this.input.getAxisValue("forward");
      let strafe = this.input.getAxisValue("strafe");

      if (Math.abs(fwd) < 0.5 && Math.abs(strafe) < 0.5) {
        this.movement.y = 0;
        this.movement.z = -this.rb.velocity.z * 0.3;
        this.movement.x = -this.rb.velocity.x * 0.3;
        this.rb.applyImpulse(this.movement);
        if (this.itemJogAnim.isPlaying) this.itemJogAnim.stop();

      } else {
        if (!this.itemJogAnim.isPlaying) this.itemJogAnim.play("jog");
      }

      this.movement
        .set(strafe, 0, fwd)
        .applyQuaternion(this.entity.transform.quaternion)
        .normalize()
        .multiply(this.isOnGround ? this.speed : this.speed / 4);

      this.rb.applyImpulse(this.movement, true);

      if (this.canJump()) this.jump();
    };
  }
  onAttach(): void {

    this.blockIndicator = new WorldEntity("block indicator");
    this.blockIndicator.getOrCreateComponent(BoxWire);
    this.blockIndicator.setParent(Globals.scene);

    // this.blockIndicator = new DebugEntity();
    // this.blockIndicator.setActive(true);

    this.cameraEntity = this.entity.getOrCreateChildByLabel("cameraAttachPoint")
      .addComponent(this.camera);
    this.cameraEntity.transform.position.set(0, 1.5, 0);

    this.camera.setMainCamera();

    const itemMesher = new FlatTexMesh();
    itemMesher.setImage("./textures/item_pickaxe.png").then(() => {

      const pickaxe = new WorldEntity()
        .setLabel("Pickaxe")
        .addComponent(itemMesher)
        .setParent(this.cameraEntity);

      pickaxe.transform.scale.set(0.5, 0.5, 0.5);
      pickaxe.transform.position.set(1.0, -0.35, -1);
      pickaxe.transform.rotation.set(Math.PI, -1, Math.PI);

      this.itemSwingAnim.setTarget(pickaxe.transform.rotation as any);
      this.itemJogAnim.setTarget(pickaxe.transform.position);
    });

    this.player = this.getComponent(Player)!; //playercontroller is added by Player, so Player should exist. otherwise error

    this.transform.position.y = 10;

    this.rb = this.getOrCreateComponent(RigidBody)
      .setEnabledRotations(false, false, false, true)
      
      .setLinearDamping(0);

    this.col = new SphereCollider(0.4);
    this.entity.addComponent(this.col);
    this.col.setFriction(0);

    this.setupInput();
  }

  setupInput() {
    this.input.getOrCreateAxis("forward")
      .addInfluence({
        value: -1,
        keys: ["w"]
      })
      .addInfluence({
        value: 1,
        gpAxes: [1]
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
        value: 1,
        gpAxes: [0]
      })
      .addInfluence({
        value: -1,
        keys: ["a"]
      });

    this.input.getOrCreateAxis("jump")
      .addInfluence({
        value: 1,
        keys: [" "]
      })
      .addInfluence({
        value: 1,
        gpButtons: [0]
      });

    this.input.getOrCreateAxis("break")
      .addInfluence({
        value: 1,
        mouseButtons: [0],
      });

    this.input.getOrCreateAxis("place")
      .addInfluence({
        value: 1,
        mouseButtons: [2]
      });

    this.input.getOrCreateAxis("h-look")
      .addInfluence({
        value: 1,
        gpAxes: [3],
      })
      .addInfluence({
        value: 1,
        mouseAxes: [0],
        pointerAxisScale: 0.008
      });
    this.input.getOrCreateAxis("v-look")
      .addInfluence({
        value: 1,
        gpAxes: [4],
        // gpAxisScale: 1000
      })
      .addInfluence({
        value: 1,
        mouseAxes: [1],
        pointerAxisScale: 0.008
      });
  }

  canBreak() {
    return (
      this.input.getAxisValue("break") === 1 &&
      this.breakTimer.update() &&
      this.rayHitPoint !== null
    );
  }
  canPlace() {
    return (
      this.input.getAxisValue("place") === 1 &&
      this.placeTimer.update() &&
      this.rayHitPoint !== null
    );
  }
  /**Result stored in this.rayHit and this.rayHitPoint
   * 
   * if no hit detected, this.rayHitPoint will be null and return will be false
   * 
   * otherwise this.rayHitPoint is populated and return will be true
  */
  detectBlockRaycast (): boolean {
    Vec3Copy(this.ray.origin, this.transform.position);

    Vec3Add(this.ray.origin, this.cameraEntity.transform.position);
    // console.log("origin", this.ray.origin);

    Vec3Set(this.ray.dir, 0, 0, -1);
    
    Vec3ApplyQuaternion(this.ray.dir, this.ray.dir, this.cameraEntity.transform.quaternion);
    Vec3ApplyQuaternion(this.ray.dir, this.ray.dir, this.entity.transform.quaternion);

    this.rayHit = Globals._rapierWorld
    .castRayAndGetNormal(
      this.ray, 16, false,
      undefined, undefined, undefined,
      this.rb._rapierRigidBody
    );
    if (this.rayHit) {
      this.rayHitPoint = this.ray.pointAt(this.rayHit.toi);
      return true;
    } else {
      this.rayHitPoint = null;
      return false;
    }
  }
  calcBlockPosition (place: boolean): this {
    Vec3Copy(this.block.position, this.rayHitPoint!);

    let distance = Vec3Dist(this.ray.origin, this.block.position);

    //place vs break, removes or adds a quarter of a block distance into raycast direction for the hit point
    // let extraDistance = place ? -0.25 : 0.25;

    // let totalDistance = distance + extraDistance;
    // let interpolant = totalDistance / distance;

    // //move the hit point backwards or forwards based on hit/break so that it is inside of a block
    // Vec3Lerp(this.block.position, this.ray.origin, this.block.position, interpolant);
    
    Vec3MulScalar(this.rayHit?.normal!, 0.25);
    if (place) Vec3Add(this.block.position, this.rayHit?.normal!);
    else Vec3Sub(this.block.position, this.rayHit?.normal!);

    //clamp coordinates to integers
    Vec3Floor(this.block.position);

    return this;
  }
  break() {
    this.calcBlockPosition(false);
    this.itemSwingAnim.play("swing");

    // Vec3Copy(this.blockIndicator.transform.position, this.block.position);
    // setTimeout(()=>{
    //   Vec3Set(this.blockIndicator.transform.position, 0,0,0);
    // }, 10);

    this.block.type = 0;
    Globals.debugChunk.setBlockData(
      this.block,
      this.block.position.x,
      this.block.position.y,
      this.block.position.z,
      true
    );

  }
  place() {
    this.calcBlockPosition(true);
    this.itemSwingAnim.play("swing");

    // Vec3Copy(this.blockIndicator.transform.position, this.block.position);
    // setTimeout(()=>{
    //   Vec3Set(this.blockIndicator.transform.position, 0,0,0);
    // }, 10);
    
    this.block.type = 1;
    Globals.debugChunk.setBlockData(
      this.block,
      this.block.position.x,
      this.block.position.y,
      this.block.position.z,
      true
    );
  }
  jump() {
    this.movement.x = 0;
    this.movement.z = 0;
    this.movement.y = 1;
    // this.movement.normalize();
    this.movement.multiply(this.jumpForce);

    this.rb.applyImpulse(this.movement, true);
  }
  canJump(): boolean {
    return (
      this.input.getAxisValue("jump") > 0.5 &&
      this.jumpTimer.update() &&
      this.isOnGround
    );
  }
  detectNearGround(): this {
    let { x, y, z } = this.transform.position;
    this.ray.origin.x = x;
    this.ray.origin.y = y + 0.1;
    this.ray.origin.z = z;

    this.ray.dir.x = 0;
    this.ray.dir.y = -1;
    this.ray.dir.z = 0;
    // this.ray.dir
    this.isOnGround = Globals._rapierWorld.castRay(
      this.ray, 1.5, true,
      undefined, undefined, undefined,
      this.rb._rapierRigidBody
    ) !== null;
    return this;
  }
}
