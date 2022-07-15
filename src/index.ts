
import { EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel, Text } from "@repcomm/exponent-ts";
import { AudioPlayer } from "./audio/audioplayer.js";
import { MCBTN } from "./ui/mcbtn.js";

import { Box, Camera, Mesh, Program, Renderer, Transform } from "ogl-typescript";
import { Chunk } from "./voxel/chunk.js";

EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main() {

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

  btnPlay.on("click", () => {
    btns.unmount();
    container.mountChild(gl.canvas);

    //TODO attach renderer
  });


  const renderer = new Renderer();
  const gl = renderer.gl;

  const camera = new Camera(gl);
  camera.position.z = Chunk.BLOCK_SIDE_LENGTH+5;
  camera.position.y = 4;

  function resize() {
    renderer.setSize(container.rect.width, container.rect.height);
    camera.perspective({
      aspect: gl.canvas.width / gl.canvas.height,
    });
  }
  window.addEventListener('resize', resize, false);
  resize();

  const scene = new Transform();

  const chunkParent = new Transform();
  chunkParent.setParent(scene);

  const chunk = new Chunk(gl);
  chunk.setParent(chunkParent);
  chunk.position.set(-Chunk.BLOCK_SIDE_LENGTH/2);

  requestAnimationFrame(update);
  function update(t: number) {
    requestAnimationFrame(update);

    chunkParent.rotation.y += 0.005;
    // mesh.rotation.x += 0.01;
    renderer.render({ scene, camera });
  }
}

main();
