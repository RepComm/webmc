// import type { Vec3 } from "ogl-typescript";

/**Linear interpolation between from and to, using 0.0 - 1.0 interpolant `by`*/
export const lerp = (from, to, by) => {
  return from * (1 - by) + to * by;
};
export function _2dTo1d(x, y, width) {
  return x + width * y;
}
export function _1dTo2dX(index, width) {
  return index % width;
}
export function _1dTo2dY(index, width) {
  return index / width;
}
export function isApprox(n, compare, approx) {
  let result = Math.abs(n - compare) < approx;
  console.log(`n: ${n} - ${compare} < ${approx} === ${result}`);
  return result;
}
export function Vec3Floor(v) {
  v.x = Math.floor(v.x);
  v.y = Math.floor(v.y);
  v.z = Math.floor(v.z);
}
export function Vec3ApplyQuaternion(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  let {
    x,
    y,
    z
  } = a;
  let qx = q.x,
      qy = q.y,
      qz = q.z,
      qw = q.w;
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
export function Vec3Copy(out, a) {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  return out;
}
export function Vec3Sub(out, a) {
  out.x -= a.x;
  out.y -= a.y;
  out.z -= a.z;
  return out;
}
export function Vec3Add(out, a) {
  out.x += a.x;
  out.y += a.y;
  out.z += a.z;
  return out;
}
export function Vec3Set(out, x, y, z) {
  out.x = x;
  out.y = y;
  out.z = z;
}
export function Vec3Lerp(out, a, b, t) {
  out.x = lerp(a.x, b.x, t);
  out.y = lerp(a.y, b.y, t);
  out.z = lerp(a.z, b.z, t);
}
export function Vec3LerpTo(a, b, t) {
  Vec3Lerp(a, a, b, t);
}
export function Vec3Dist(a, b) {
  let x = b.x - a.x;
  let y = b.y - a.y;
  let z = b.z - a.z;
  return Math.sqrt(x * x + y * y + z * z);
}