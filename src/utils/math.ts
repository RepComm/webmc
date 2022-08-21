
// import type { Vec3 } from "ogl-typescript";

export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}
export interface QuaternionLike {
  x: number;
  y: number;
  z: number;
  w: number;
}
/**Linear interpolation between from and to, using 0.0 - 1.0 interpolant `by`*/
export const lerp = (from: number, to: number, by: number): number => {
  return from*(1-by)+to*by;
}

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
export function Vec3Floor (v: Vec3Like) {
  v.x = Math.floor(v.x);
  v.y = Math.floor(v.y);
  v.z = Math.floor(v.z);
}

export function Vec3ApplyQuaternion(out: Vec3Like, a: Vec3Like, q: QuaternionLike): Vec3Like {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  let { x, y, z } = a;

  let qx = q.x, qy = q.y, qz = q.z, qw = q.w;
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out.x = x + uvx + uuvx;
  out.y = y + uvy + uuvy;
  out.z = z + uvz + uuvz;
  return out;
}
export function Vec3Copy(out: Vec3Like, a: Vec3Like): Vec3Like {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  return out;
}
export function Vec3Sub(out: Vec3Like, a: Vec3Like): Vec3Like {
  out.x -= a.x;
  out.y -= a.y;
  out.z -= a.z;
  return out;
}
export function Vec3Add(out: Vec3Like, a: Vec3Like): Vec3Like {
  out.x += a.x;
  out.y += a.y;
  out.z += a.z;
  return out;
}
export function Vec3Set(out: Vec3Like, x: number, y: number, z: number) {
  out.x = x;
  out.y = y;
  out.z = z;
}
export function Vec3Lerp (out: Vec3Like, a: Vec3Like, b: Vec3Like, t: number) {
  out.x = lerp(a.x, b.x, t);
  out.y = lerp(a.y, b.y, t);
  out.z = lerp(a.z, b.z, t);
}
export function Vec3LerpTo(a: Vec3Like, b: Vec3Like, t: number) {
  Vec3Lerp(a, a, b, t);
}
export function Vec3Dist (a: Vec3Like, b: Vec3Like): number {
    let x = b.x - a.x;
    let y = b.y - a.y;
    let z = b.z - a.z;
    return Math.sqrt(
      x * x +
      y * y +
      z * z
    );
}
export function Vec3MulScalar (a: Vec3Like, scalar: number) {
  a.x *= scalar;
  a.y *= scalar;
  a.z *= scalar;
}