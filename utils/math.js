export function _2dTo1d(x, y, width) {
  return x + width * y;
}
export function _1dTo2dX(index, width) {
  return index % width;
}
export function _1dTo2dY(index, width) {
  return index / width;
}