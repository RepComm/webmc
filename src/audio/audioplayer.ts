

export class AudioPlayer {
  private static SINGLETON: AudioPlayer;

  private sounds: Map<string, HTMLAudioElement>;

  constructor () {
    this.sounds = new Map();
  }

  static get (): AudioPlayer {
    if (!AudioPlayer.SINGLETON) AudioPlayer.SINGLETON = new AudioPlayer();
    return AudioPlayer.SINGLETON;
  }

  loadAudio (url: string, id: string): Promise<void> {
    return new Promise(async (_resolve, _reject)=>{
      try {
        let audio = new Audio(url);

        this.sounds.set(id, audio);
        _resolve();
        return;
      } catch (ex) {
        _reject(ex);
        return;
      }

    });
  }
  getAudio (id: string): HTMLAudioElement {
    return this.sounds.get(id)!;
  }
}
