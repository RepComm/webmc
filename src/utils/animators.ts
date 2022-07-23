
import { Vec3 } from "ogl-typescript";
import { lerp, Track } from "./anim.js";

export interface Clip {
  name: string;
  start: number;
  end: number;
  loop: boolean;
  durationMillis: number;
  fps: number;
}

export class Vec3Animator {
  private _target: Vec3;
  private xTrack: Track;
  private yTrack: Track;
  private zTrack: Track;
  private clips: Map<string, Clip>;
  private currentClip: Clip;
  private currentSeek: number;

  private clipInterval: number;
  private lastStartTime: number;
  private timeElapsed: number;
  private _isPlaying: boolean;

  constructor () {
    this.xTrack = new Track();
    this.yTrack = new Track();
    this.zTrack = new Track();
    this.clips = new Map();
    this._isPlaying = false;
  }
  setTarget (target: Vec3): this {
    this._target = target;
    return this;
  }
  setValueAtTime (time: number, x: number, y: number, z: number): this {
    this.xTrack.setValueAtTime(time, x);
    this.yTrack.setValueAtTime(time, y);
    this.zTrack.setValueAtTime(time, z);
    return this;
  }
  getValueAtTime (time: number, out: Vec3): this {
    out.x = this.xTrack.getValueAtTime(time);
    out.y = this.yTrack.getValueAtTime(time);
    out.z = this.zTrack.getValueAtTime(time);
    return this;
  }
  get duration (): number {
    return this.xTrack.duration;
  }
  createClip (clip: Clip): this {
    this.clips.set(clip.name, clip);
    return this;
  }
  get isPlaying (): boolean {
    return this._isPlaying;
  }
  play(clipName: string): this {
    let clip = this.clips.get(clipName);
    if (!clip) return;
    this.currentClip = clip;

    this._isPlaying = true;
    this.lastStartTime = Date.now();
    this.clipInterval = setInterval(()=>{
      //just in case stopping doesn't trigger right away
      if (!this._isPlaying || !this._target) {
        this.stop(); return;
      };

      this.timeElapsed = Date.now() - this.lastStartTime;
      if (this.timeElapsed > this.currentClip.durationMillis) {
        this.timeElapsed = this.currentClip.durationMillis;
        this.calculate();
        this.stop();
        return;
      }
      
      this.calculate();
    }, 1000/clip.fps);

    return this;
  }
  calculate (): this {
    this.currentSeek = lerp(
      this.currentClip.start,
      this.currentClip.end,
      this.timeElapsed / this.currentClip.durationMillis
    );
    
    this.getValueAtTime(this.currentSeek, this._target);
    return this;
  }
  stop (): this {
    if (this.clipInterval) clearInterval(this.clipInterval);
    this._isPlaying = false;
    return this;
  }
}
