import { EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel, Text } from "@repcomm/exponent-ts";
import { AudioPlayer } from "./audio/audioplayer.js";
import { MCBTN } from "./ui/mcbtn.js";
import { Camera, Mesh, Program, Renderer, Transform } from "ogl-typescript";
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
    container.mountChild(gl.canvas); //TODO attach renderer
  });
  const renderer = new Renderer();
  const gl = renderer.gl; // container.mountChild(gl.canvas);

  const camera = new Camera(gl);
  camera.position.z = 5;
  camera.position.y = 2;

  function resize() {
    renderer.setSize(container.rect.width, container.rect.height);
    camera.perspective({
      aspect: gl.canvas.width / gl.canvas.height
    });
  }

  window.addEventListener('resize', resize, false);
  resize();
  const scene = new Transform();
  const geometry = new Chunk(gl);
  const program = new Program(gl, {
    vertex:
    /* glsl */
    `
      attribute vec3 position;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment:
    /* glsl */
    `
      void main() {
        gl_FragColor = vec4(1.0);
      }
    `
  });
  const mesh = new Mesh(gl, {
    geometry,
    program
  });
  mesh.setParent(scene);
  requestAnimationFrame(update);

  function update(t) {
    requestAnimationFrame(update);
    mesh.rotation.y -= 0.01; // mesh.rotation.x += 0.01;

    renderer.render({
      scene,
      camera
    });
  }
}

main();