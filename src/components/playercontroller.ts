
import { Quaternion, Ray, RayColliderIntersection, Vector, World } from "@dimforge/rapier3d-compat";
import { GameInput } from "@repcomm/gameinput-ts";
import { Vec3 } from "ogl-typescript";
import { WorldEntity } from "../entities/worldentity.js";
import { Globals } from "../utils/global.js";
import { SphereCollider } from "./spherecollider.js";
import { Player } from "./player.js";
import { RigidBody } from "./rigidbody.js";
import { WorldComponent } from "./worldcomponent.js";
import { DebugEntity } from "../entities/debugentity.js";
import { Block } from "../voxel/block.js";
import { FlatTexMesh } from "./flattexmesh.js";
import { Vec3Animator } from "../utils/animators.js";
import { Camera } from "./camera.js";
import { lerp } from "../utils/anim.js";
import { isApprox, Vec3Floor } from "../utils/math.js";

export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}
function Vec3ApplyQuaternion(out: Vec3Like, a: Vec3Like, q: Quaternion): Vec3Like {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  let { x, y, z } = a;

  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out.x = x + uvx + uuvx;
  out.y = y + uvy + uuvy;
  out.z = z + uvz + uuvz;
  return out;
}
function Vec3Copy(out: Vec3Like, a: Vec3Like): Vec3Like {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  return out;
}
function Vec3Sub(out: Vec3Like, a: Vec3Like): Vec3Like {
  out.x -= a.x;
  out.y -= a.y;
  out.z -= a.z;
  return out;
}
function Vec3Add(out: Vec3Like, a: Vec3Like): Vec3Like {
  out.x += a.x;
  out.y += a.y;
  out.z += a.z;
  return out;
}

export class PlayerController extends WorldComponent {
  debugEntity: DebugEntity;

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
  timeLastJump: number;
  timeWaitJump: number;

  timeLastBreak: number;
  timeWaitBreak: number;

  timeLastPlace: number;
  timeWaitPlace: number;

  block: Block;

  constructor() {
    super();
    this.movement = new Vec3();
    this.speed = 1;
    this.lookSensitivity = 0.25;
    this.input = GameInput.get();

    this.jumpForce = 10;
    this.isOnGround = false;
    this.timeLastJump = 0;
    this.timeWaitJump = 400;

    this.timeLastBreak = 0;
    this.timeWaitBreak = 200;

    this.timeLastPlace = 0;
    this.timeWaitPlace = 100;

    this.camera = new Camera();

    this.ray = new Ray({ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: -1.0, z: 0.0 });
    // this.rayHit = undefined;

    this.block = new Block();

    this.itemSwingAnim = new Vec3Animator()
      .createClip({
        durationMillis: 100,
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

    let jogLeftMost = 0.8;
    let jogRightMost = 1.5;
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
        jogLeftMost, 0, -1
      )
      .setValueAtTime(1,
        lerp(jogLeftMost, jogRightMost, 0.5), -0.3, -1
      )
      .setValueAtTime(2,
        jogRightMost, 0, -1
      )
      .setValueAtTime(3,
        lerp(jogLeftMost, jogRightMost, 0.5), -0.3, -1
      )
      .setValueAtTime(4,
        jogLeftMost, 0, -1
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
        this.detectBlockFocus();
        Vec3Copy(this.debugEntity.transform.position, this.block.position);
        // Vec3Copy(this.debugEntity.transform.position, this.transform.position);

        if (this.canBreak()) this.break();
        if (this.canPlace()) this.place();
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
        if (this.itemJogAnim.isPlaying) this.itemJogAnim.stop();

      } else {
        if (!this.itemJogAnim.isPlaying) this.itemJogAnim.play("jog");
      }

      this.movement
        .set(strafe, 0, fwd)
        .applyQuaternion(this.entity.transform.quaternion)
        .normalize()
        .multiply(this.speed);

      this.rb.applyImpulse(this.movement, true);

      if (this.canJump()) this.jump();
    };
  }
  onAttach(): void {

    this.debugEntity = new DebugEntity();
    this.debugEntity.setActive(true);

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

      pickaxe.transform.position.set(1.5, 0, -1);
      pickaxe.transform.rotation.set(Math.PI, -1, Math.PI);

      this.itemSwingAnim.setTarget(pickaxe.transform.rotation as any);
      this.itemJogAnim.setTarget(pickaxe.transform.position);
    });

    this.player = this.getComponent(Player)!; //playercontroller is added by Player, so Player should exist. otherwise error

    this.transform.position.y = 10;

    this.rb = this.getOrCreateComponent(RigidBody)
      .setEnabledRotations(false, false, false, true)
      .setLinearDamping(1);

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
      Date.now() - this.timeLastBreak > this.timeWaitBreak &&
      this.rayHit !== null
    );
  }
  canPlace() {
    return (
      this.input.getAxisValue("place") === 1 &&
      Date.now() - this.timeLastPlace > this.timeWaitPlace &&
      this.rayHit !== null
    );
  }
  detectBlockFocus() {
    Vec3Copy(this.ray.origin, this.transform.position);

    Vec3Add(this.ray.origin, this.cameraEntity.transform.position);
    // console.log("origin", this.ray.origin);

    Vec3ApplyQuaternion(this.ray.dir, this.ray.dir, this.entity.transform.quaternion);
    Vec3ApplyQuaternion(this.ray.dir, this.ray.dir, this.cameraEntity.transform.quaternion);

    // console.log(this.ray.dir);

    this.rayHit = Globals._rapierWorld
      .castRayAndGetNormal(
        this.ray, 16, false,
        undefined, undefined, undefined,
        this.rb._rapierRigidBody
      );
    if (this.rayHit) {
      this.rayHitPoint = this.ray.pointAt(this.rayHit.toi);

      Vec3Copy(this.block.position, this.rayHitPoint);

      Vec3Sub(this.block.position, this.rayHit.normal);

      Vec3Floor(this.block.position);

    } else {
      this.rayHitPoint = null;

    }
  }
  break() {
    if (!this.rayHit) return;
    this.timeLastBreak = Date.now();
    this.itemSwingAnim.play("swing");

    // this.debugEntity.transform.position.set(
    //   hitPoint.x,
    //   hitPoint.y,
    //   hitPoint.z
    // );

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
    if (!this.rayHit) return;
    this.timeLastPlace = Date.now();
    this.itemSwingAnim.play("swing");

    // this.debugEntity.transform.position.set(
    //   hitPoint.x,
    //   hitPoint.y,
    //   hitPoint.z
    // );

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
    this.timeLastJump = Date.now();
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
      Date.now() - this.timeLastJump > this.timeWaitJump &&
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
