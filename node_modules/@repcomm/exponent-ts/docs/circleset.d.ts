export declare class CircleSet<T> {
    private internal;
    private currentIndex;
    constructor();
    add(...items: Array<T>): this;
    next(): T;
    /**Removes items from the set
     * Warning, performs array.splice for each item removed, could be expensive
     * @param items
     */
    remove(items: Array<T>): this;
    /**Checks if item is in the set
     * Warning: Expensive on large sets
     * @param item
     */
    has(item: T): boolean;
}
