
import RAPIER from "@dimforge/rapier3d-compat";

import { EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel, Text } from "@repcomm/exponent-ts";
import { Renderer, Vec2 } from "ogl-typescript";
import { AudioPlayer } from "./audio/audioplayer.js";
import { Chunk } from "./components/chunk.js";
import { Player } from "./components/player.js";
import { WorldEntity } from "./entities/worldentity.js";
import { Hotbar } from "./ui/hotbar.js";
import { MCBTN } from "./ui/mcbtn.js";
import { SceneGraph } from "./ui/scenegraph.js";
import { AtlasBuilder } from "./utils/atlas.js";
import { Globals } from "./utils/global.js";
import { BlockTextureSlot, BlockType } from "./voxel/blockdef.js";

EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main() {
  await RAPIER.init();
  Globals._rapierWorld = new RAPIER.World({x: 0, y: -16, z: 0});
  // console.log("Loaded rapier", RAPIER);
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
  .setTranslation(0,0, 0);
  Globals._rapierWorld.createCollider(groundColliderDesc);

  const ap = AudioPlayer.get();
  await ap.loadAudio("./audio/arcadiadica.wav", "arcadiadica");

  let music = ap.getAudio("arcadiadica");
  music.loop = true;
  music.play();

  await ap.loadAudio("./audio/btn_0.wav", "btn_0");
  let btn_0 = ap.getAudio("btn_0");

  const container = new Panel()
    .setId("container")
    .mount(document.body);

  const btns = new Panel()
    .setId("buttons")
    .on("click", () => {
      btn_0.fastSeek(0);
      btn_0.play();
    })
    .mount(container);

  const title = new Text()
    .setId("title")
    .setTextContent("Web MC")
    .mount(btns);

  const btnPlay = new MCBTN()
    .setTextContent("Play")
    .mount(btns);

  const btnSettings = new MCBTN()
    .setTextContent("Settings")
    .mount(btns);

  const btnAbout = new MCBTN()
    .setTextContent("About")
    .mount(btns);

  const hud = new Panel()
  .setId("hud");

  const hotbar = new Hotbar()
  .setId("hotbar")
  .mount(hud);
  
  hotbar.items[0].setItem({
    frameImageUrl: "./textures/item_pickaxe.png"
  });
  hotbar.items[1].setItem({
    frameImageUrl: "./textures/all_stone.png"
  });

  btnPlay.on("click", () => {
    btns.unmount();
    // container.mountChild(sceneGraphDisplay);
    container.mountChild(gl.canvas);
    container.mountChild(hud);
  });

  const sceneGraphDisplay = new SceneGraph();
  // .mount(container);

  const renderer = new Renderer();
  const gl = renderer.gl;
  gl.canvas.style["max-width"] = "100%";
  gl.canvas.style["max-height"] = "100%";
  Globals.gl = gl;

  function resize() {
    renderer.setSize(container.rect.width, container.rect.height);
  }
  window.addEventListener('resize', resize, false);
  resize();

  Globals.scene = new WorldEntity().setLabel("Scene");

  let atlasBuilder = new AtlasBuilder();

  atlasBuilder.init({
    faceSize: new Vec2(16, 16),
    width: 16*4,
    height: 16*4
  });

  // await atlasBuilder.loadTexture(
  //   "./textures/all_unknown.png",
  //   BlockType.UNKNOWN, BlockTextureSlot.MAIN
  // );

  await atlasBuilder.loadTexture(
    "./textures/all_stone.png",
    BlockType.STONE, BlockTextureSlot.MAIN
  );

  await atlasBuilder.loadTexture(
    "./textures/all_dirt.png",
    BlockType.DIRT, BlockTextureSlot.MAIN
  );

  await atlasBuilder.loadTexture(
    "./textures/side_grass.png",
    BlockType.GRASS, BlockTextureSlot.SIDE
  );
  await atlasBuilder.loadTexture(
    "./textures/top_grass.png",
    BlockType.GRASS, BlockTextureSlot.UP
  );

  Globals.atlas = await atlasBuilder.build();
  // console.log(Globals.atlas.texture);

  const chunk = new WorldEntity()
  .setLabel("Chunk")
  .setParent(Globals.scene)
  .addComponent(new Chunk());
  
  // chunk.transform.position.set(-Chunk.BLOCK_SIDE_LENGTH / 2);

  const player = new WorldEntity();
  player.transform.position.set(
    Chunk.BLOCK_SIDE_LENGTH/2,
    Chunk.BLOCK_SIDE_LENGTH,
    Chunk.BLOCK_SIDE_LENGTH/2
  );

  player.addComponent(new Player())
  .setParent(Globals.scene)
  .setLabel("Player");

  sceneGraphDisplay.setRootNode(Globals.scene);

  requestAnimationFrame(update);
  function update(t: number) {
    requestAnimationFrame(update);
    
    if (Globals.scene && Globals.mainCamera) renderer.render({ scene: Globals.scene.transform, camera: Globals.mainCamera });
  }

  setInterval(()=>{
    Globals._rapierWorld.step();
    Globals.scene.onUpdate();
  }, Globals.delta);
}

main();
