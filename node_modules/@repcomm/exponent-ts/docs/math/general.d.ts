/**Artificial minimum standard*/
export declare const EPSILON = 0.00001;
/**Convert degrees to radians*/
export declare const radians: (deg: number) => number;
/**Returns the abs distance between two numbers, works with negatives*/
export declare const ndist: (v0: number, v1: number) => number;
/**Clamps value between min and max*/
export declare const clamp: (value: number, min: number, max: number) => number;
/**Returns a Math.random value between 0 and 255*/
export declare const randomByte: () => number;
/**Linear interpolation between from and to, using 0.0 - 1.0 interpolant `by`*/
export declare const lerp: (from: number, to: number, by: number) => number;
/**Performs the inverse of lerp
 * Will give you the interpolant given the interpolated number and its bounds (to and from)
 */
export declare const inverseLerp: (from: number, to: number, value: number) => number;
export declare const dist: (x1: number, y1: number, x2: number, y2: number) => number;
export declare const roundToNext: (n: any, next: any) => number;
