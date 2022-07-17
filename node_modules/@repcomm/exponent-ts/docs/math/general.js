/**Artificial minimum standard*/
export const EPSILON = 0.00001;
/**Convert degrees to radians*/

export const radians = deg => deg * Math.PI / 180;
/**Returns the abs distance between two numbers, works with negatives*/

export const ndist = (v0, v1) => Math.abs(Math.abs(v0) - Math.abs(v1));
/**Clamps value between min and max*/

export const clamp = (value, min, max) => {
  return Math.max(Math.min(value, max), min);
};
/**Returns a Math.random value between 0 and 255*/

export const randomByte = () => Math.floor(Math.random() * 255);
/**Linear interpolation between from and to, using 0.0 - 1.0 interpolant `by`*/

export const lerp = (from, to, by) => {
  return from * (1 - by) + to * by;
};
/**Performs the inverse of lerp
 * Will give you the interpolant given the interpolated number and its bounds (to and from)
 */

export const inverseLerp = (from, to, value) => {
  return (value - from) / (to - from);
};
export const dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
export const roundToNext = (n, next) => {
  let isNeg = n < 0;

  if (isNeg) {
    n -= next;
  }

  ;
  let resto = n % next;

  if (resto <= next) {
    return n - resto;
  } else {
    return n + next - resto;
  }
};