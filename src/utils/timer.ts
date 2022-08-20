
export class Timer {
  timeLast: number;
  timeInterval: number;

  constructor (interval: number) {
    this.timeInterval = interval;
    this.timeLast = 0;
  }
  static fps (fps: number): Timer {
    return new Timer(1000/fps);
  }
  update (): boolean {
    let now = Date.now();
    if ( now - this.timeLast >= this.timeInterval) {
      this.timeLast = now;
      return true;
    }
    return false;
  }
}
