
import type { Vec3 } from "ogl-typescript";

export function _2dTo1d(x: number, y: number, width: number): number {
  return x + width * y;
}
export function _1dTo2dX(index: number, width: number): number {
  return index % width;
}
export function _1dTo2dY(index: number, width: number): number {
  return index / width;
}
export function isApprox (n: number, compare: number, approx: number): boolean {
  let result = Math.abs(n - compare) < approx;
  console.log(`n: ${n} - ${compare} < ${approx} === ${result}`);
  return result;
}
export function Vec3Floor (v: Vec3) {
  v.x = Math.floor(v.x);
  v.y = Math.floor(v.y);
  v.z = Math.floor(v.z);
}