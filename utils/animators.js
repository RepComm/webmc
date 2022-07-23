import { lerp, Track } from "./anim.js";
export class Vec3Animator {
  constructor() {
    this.xTrack = new Track();
    this.yTrack = new Track();
    this.zTrack = new Track();
    this.clips = new Map();
    this._isPlaying = false;
  }

  setTarget(target) {
    this._target = target;
    return this;
  }

  setValueAtTime(time, x, y, z) {
    this.xTrack.setValueAtTime(time, x);
    this.yTrack.setValueAtTime(time, y);
    this.zTrack.setValueAtTime(time, z);
    return this;
  }

  getValueAtTime(time, out) {
    out.x = this.xTrack.getValueAtTime(time);
    out.y = this.yTrack.getValueAtTime(time);
    out.z = this.zTrack.getValueAtTime(time);
    return this;
  }

  get duration() {
    return this.xTrack.duration;
  }

  createClip(clip) {
    this.clips.set(clip.name, clip);
    return this;
  }

  get isPlaying() {
    return this._isPlaying;
  }

  play(clipName) {
    let clip = this.clips.get(clipName);
    if (!clip) return;
    this.currentClip = clip;
    this._isPlaying = true;
    this.lastStartTime = Date.now();
    this.clipInterval = setInterval(() => {
      //just in case stopping doesn't trigger right away
      if (!this._isPlaying || !this._target) {
        this.stop();
        return;
      }

      ;
      this.timeElapsed = Date.now() - this.lastStartTime;

      if (this.timeElapsed > this.currentClip.durationMillis) {
        this.timeElapsed = this.currentClip.durationMillis;
        this.calculate();
        this.stop();
        return;
      }

      this.calculate();
    }, 1000 / clip.fps);
    return this;
  }

  calculate() {
    this.currentSeek = lerp(this.currentClip.start, this.currentClip.end, this.timeElapsed / this.currentClip.durationMillis);
    this.getValueAtTime(this.currentSeek, this._target);
    return this;
  }

  stop() {
    if (this.clipInterval) clearInterval(this.clipInterval);
    this._isPlaying = false;
    return this;
  }

}