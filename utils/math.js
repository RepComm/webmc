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