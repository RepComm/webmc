export class AudioPlayer {
  constructor() {
    this.sounds = new Map();
  }

  static get() {
    if (!AudioPlayer.SINGLETON) AudioPlayer.SINGLETON = new AudioPlayer();
    return AudioPlayer.SINGLETON;
  }

  loadAudio(url, id) {
    var _this = this;

    return new Promise(async function (_resolve, _reject) {
      try {
        let audio = new Audio(url);

        _this.sounds.set(id, audio);

        _resolve();

        return;
      } catch (ex) {
        _reject(ex);

        return;
      }
    });
  }

  getAudio(id) {
    return this.sounds.get(id);
  }

}