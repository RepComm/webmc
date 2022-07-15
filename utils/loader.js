import { Texture } from "ogl-typescript";
export class Loader {
  static loadTexture(gl, url) {
    return new Promise(async function (_resolve, _reject) {
      const result = new Texture(gl);
      const img = new Image();
      img.src = url;

      img.onload = () => {
        result.image = img;

        _resolve(result);

        return;
      };

      img.onerror = err => {
        _reject(err);

        return;
      };
    });
  }

}