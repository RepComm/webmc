export class Timer {
  constructor(interval) {
    this.timeInterval = interval;
    this.timeLast = 0;
  }

  static fps(fps) {
    return new Timer(1000 / fps);
  }

  update() {
    let now = Date.now();

    if (now - this.timeLast >= this.timeInterval) {
      this.timeLast = now;
      return true;
    }

    return false;
  }

}