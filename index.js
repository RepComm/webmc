import { EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel, Text } from "@repcomm/exponent-ts";
import { Box, Camera, Program, Renderer, Mesh as OGLMesh } from "ogl-typescript";
import { Globals } from "./utils/global.js";
import { AudioPlayer } from "./audio/audioplayer.js";
import { WorldEntity } from "./entities/worldentity.js";
import { MCBTN } from "./ui/mcbtn.js";
import { SceneGraph } from "./ui/scenegraph.js";
import { Player } from "./components/player.js";
import { Chunk } from "./components/chunk.js";
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
  const container = new Panel().setId("container").mount(document.body);
  const btns = new Panel().setId("buttons").on("click", () => {
    btn_0.fastSeek(0);
    btn_0.play();
  }).mount(container);
  const title = new Text().setId("title").setTextContent("Web MC").mount(btns);
  const btnPlay = new MCBTN().setTextContent("Play").mount(btns);
  const btnSettings = new MCBTN().setTextContent("Settings").mount(btns);
  const btnAbout = new MCBTN().setTextContent("About").mount(btns);
  btnPlay.on("click", () => {
    btns.unmount();
    container.mountChild(sceneGraphDisplay);
    container.mountChild(gl.canvas);
  });
  const sceneGraphDisplay = new SceneGraph(); // .mount(container);

  const renderer = new Renderer();
  const gl = renderer.gl;
  gl.canvas.style["max-width"] = "100%";
  gl.canvas.style["max-height"] = "100%";
  Globals.gl = gl;
  const camera = new Camera(gl);
  camera.position.z = Chunk.BLOCK_SIDE_LENGTH + 5;
  camera.position.y = 2;

  function resize() {
    renderer.setSize(container.rect.width, container.rect.height);
    camera.perspective({
      aspect: gl.canvas.width / gl.canvas.height
    });
  }

  window.addEventListener('resize', resize, false);
  resize();
  const scene = new WorldEntity();
  scene.label = "Scene";
  const chunkParent = new WorldEntity();
  chunkParent.label = "Chunk Parent";
  chunkParent.setParent(scene.transform);

  function createTestBox() {
    const geometry = new Box(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        void main() {
          gl_FragColor = vec4(1.0);
        }
      `
    });
    const mesh = new OGLMesh(gl, {
      geometry,
      program
    });
    mesh.setParent(chunkParent.transform);
  }

  createTestBox();
  const chunk = new WorldEntity().setLabel("Chunk").setParent(chunkParent).addComponent(new Chunk());
  chunk.transform.position.set(-Chunk.BLOCK_SIDE_LENGTH / 2);
  const player = new WorldEntity().addComponent(new Player()).setParent(scene).setLabel("Player");
  sceneGraphDisplay.setRootNode(scene); // scene.traverse((child, depth) => {
  //   let cns = [];
  //   for (let c of child.components) {
  //     cns.push(c.constructor.name);
  //   }
  //   console.log(`Depth: ${depth}, Label: "${child.label}", Components: ${cns}`);
  // });

  requestAnimationFrame(update);

  function update(t) {
    requestAnimationFrame(update);
    chunkParent.transform.rotation.y += 0.005; // mesh.rotation.x += 0.01;

    renderer.render({
      scene: scene.transform,
      camera
    });
  }

  setInterval(() => {
    scene.onUpdate();
  }, 1000 / 10);
}

main();