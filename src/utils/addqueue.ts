

export class AddQueue<T> {
  private list: Array<T>;
  
  private offset: number;
  
  constructor () {
    this.list = new Array();
  }
  
  next (): T {
    var result = this.list[this.offset];
    this.offset ++;
    return result;
  }
  
  reset (): void {
    this.offset = 0;
  }
  
  clear (): void {
    this.reset();
    this.list.length = 0;
  }
  
  hasNext (): boolean {
    return this.offset < this.list.length;
  }
  
  add (...i: T[]): void {
    this.list.push(...i);
  }
  
  remove (): T {
    let result: T;
    
//    if (this.offset < 1) result = this.list.remove(this.offset);
//    else result = this.list.remove(this.offset-1);
    
    result = this.list.splice(this.offset-1, 1)[0];

    this.offset--;
    
    return result;
  }
  
  size (): number {
    return this.list.length;
  }
  
}
