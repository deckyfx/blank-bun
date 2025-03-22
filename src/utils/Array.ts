import { effect } from "reactive-signal";
declare global {
  interface Array<T> {
    /**
     * Add new element at next position where matcher function return true
     *
     * @param matcherFunction (element: T, index: number, array: T[]): boolean
     * @param elementToAdd
     * @returns Self array
     */
    addAfter: (
      matcher: (element: T, index: number, array: T[]) => boolean,
      elementToAdd: T
    ) => Array<T>;

    /**
     * Add new element at previous position where matcher function return true
     *
     * @param matcherFunction (element: T, index: number, array: T[]): boolean
     * @param elementToAdd
     * @returns Self array
     *
     */
    addBefore: (
      matcher: (element: T, index: number, array: T[]) => boolean,
      elementToAdd: T
    ) => Array<T>;

    /**
     * Return element at given position
     */
    at(index: number): T;

    /**
     * Splits an array into chunks of a specified size.
     *
     * @param size chunk length
     * @returns new array of splitted array
     */
    chunk(size: number): T[][]; // * Splits an array into chunks of a specified size.

    /**
     * Return first found element fullfiling matcher function
     *
     * @param matcherFunction (element: T, index: number, array: T[]): boolean
     */
    first(
      matcher?: (element: T, index: number, array: T[]) => boolean
    ): T | undefined; // * Get the first matching

    /**
     * Return index of first found element fullfiling matcher function
     *
     * @param matcherFunction (element: T, index: number, array: T[]): boolean
     */
    firstIndex(
      matcher: (element: T, index: number, array: T[]) => boolean
    ): number | undefined;

    /**
     * Return flatten nested array to one up level
     *
     * @param callback(value: T, index: number, array: T[]): U[]
     */
    flatMap<U>(callback: (value: T, index: number, array: T[]) => U[]): U[];

    /**
     * Return json element of grouped array
     *
     * @param callback(value: T, index: number, array: T[]): U[]
     */
    groupBy<K extends string | number | symbol>(
      keySelector: (item: T) => K
    ): Record<K, T[]>; // * create json with grouped array elements

    /**
     * Return last found element fullfiling matcher function
     *
     * @param matcherFunction (element: T, index: number, array: T[]): boolean
     */
    last(
      matcher?: (element: T, index: number, array: T[]) => boolean
    ): T | undefined; // * Get the last matching

    /**
     * Return index of last found element fullfiling matcher function
     *
     * @param matcherFunction (element: T, index: number, array: T[]): boolean
     */
    lastIndex(
      matcher: (element: T, index: number, array: T[]) => boolean
    ): number | undefined;

    /**
     * Remove element fulfilling matcher function
     *
     * @param matcherFunction (element: T, index: number, array: T[]): boolean
     */
    remove(
      matcher: T | ((element: T, index: number, array: T[]) => boolean)
    ): Array<T>;

    /**
     * pick a random element
     */
    sample(): T | undefined;

    /**
     * Replace element at position of fulfilling matcher function, or at at given position
     *
     * @param matcherFunction number | (element: T, index: number, array: T[]): boolean
     * @param newElement
     */
    setAt(
      matcher: number | ((element: T, index: number, array: T[]) => boolean),
      element: T
    ): Array<T>; // * swap two element in array

    /**
     * Shuffle the array
     */
    shuffle(): Array<T>; // * Shuffle the array

    /**
     * Swap elements postition matching both matcher or both location
     *
     * @param matcherFunction1 number | (element: T, index: number, array: T[]): boolean
     * @param matcherFunction2 number | (element: T, index: number, array: T[]): boolean
     */
    swap(
      matcher1: number | ((element: T, index: number, array: T[]) => boolean),
      matcher2: number | ((element: T, index: number, array: T[]) => boolean)
    ): Array<T>; // * swap two element in array

    /**
     * Get first element
     */
    head(): T;

    /**
     * Get last element
     */
    tail(): T;

    /**
     * Get position of last element
     */
    tailIndex(): number;
  }
}
/**
 *
 *
 * @template T
 * @param {(element: T, index: number, array: T[]) => boolean} matcher
 * @param {T} elementToAdd
 * @return {*}
 */
Array.prototype.addAfter = function <T>(
  matcher: (element: T, index: number, array: T[]) => boolean,
  elementToAdd: T
) {
  const index = this.findIndex(matcher);
  if (index !== -1) {
    this.splice(index + 1, 0, elementToAdd);
  }
  return this;
};

Array.prototype.addBefore = function <T>(
  matcher: (element: T, index: number, array: T[]) => boolean,
  elementToAdd: T
) {
  const index = this.findIndex(matcher);
  if (index !== -1) {
    this.splice(index, 0, elementToAdd);
  }
  return this;
};

Array.prototype.at = function (index = 0) {
  return this[index];
};

Array.prototype.chunk = function <T = any>(size: number): T[][] {
  return this.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);
    acc[chunkIndex] = [...(acc[chunkIndex] || []), item];
    return acc;
  }, []);
};

Array.prototype.first = function <T = any>(
  matcher?: (element: T, index: number, array: T[]) => boolean
): T | undefined {
  if (!matcher) {
    return this[0];
  }
  const index = this.firstIndex(matcher);
  return index !== undefined ? this[index] : undefined;
};

Array.prototype.firstIndex = function <T = any>(
  matcher: (element: T, index: number, array: T[]) => boolean
): number | undefined {
  for (let i = 0; i < this.length; i++) {
    if (matcher(this[i], i, this)) {
      return i;
    }
  }
  return undefined;
};

Array.prototype.flatMap = function <U, T = any>(
  callback: (value: T, index: number, array: T[]) => U[]
): U[] {
  return this.reduce((acc, value, index, array) => {
    return acc.concat(callback(value, index, array));
  }, []);
};

Array.prototype.groupBy = function <
  K extends string | number | symbol,
  T = any
>(keySelector: (item: T) => K): Record<K, T[]> {
  return this.reduce((groups, item) => {
    const key = keySelector(item);
    groups[key] = (groups[key] || []).concat(item);
    return groups;
  }, {});
};

Array.prototype.last = function <T = any>(
  matcher?: (element: T, index: number, array: T[]) => boolean
): T | undefined {
  if (!matcher) {
    return this.tail();
  }
  const index = this.lastIndex(matcher);
  return index !== undefined ? this[index] : undefined;
};

Array.prototype.lastIndex = function <T>(
  matcher: (element: T, index: number, array: T[]) => boolean
): number | undefined {
  for (let i = this.length - 1; i >= 0; i--) {
    if (matcher(this[i], i, this)) {
      return i;
    }
  }
  return undefined;
};

Array.prototype.remove = function (o) {
  if (typeof o === "function") {
    this.splice(this.findIndex(o), 1);
  } else {
    this.splice(this.indexOf(o), 1);
  }
  return this;
};

Array.prototype.sample = function <T = any>(): T | undefined {
  if (this.length === 0) return undefined;
  return this.at(Math.floor(Math.random() * this.length));
};

Array.prototype.setAt = function (matcher, element) {
  const index = typeof matcher === "number" ? matcher : this.findIndex(matcher);
  this[index] = element;
  return this;
};

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

Array.prototype.swap = function (matcher1, matcher2) {
  // Handle index-based switching
  if (typeof matcher1 === "number" && typeof matcher2 === "number") {
    [this[matcher1], this[matcher2]] = [this[matcher2], this[matcher1]];
  }
  // Handle function-based switching
  else if (typeof matcher1 === "function" && typeof matcher2 === "function") {
    const index1 = this.findIndex(matcher1);
    const index2 = this.findIndex(matcher2);
    if (index1 !== -1 && index2 !== -1) {
      [this[index1], this[index2]] = [this[index2], this[index1]];
    }
  }
  return this;
};

Array.prototype.head = function <T = any>(): T {
  return this.at(0);
};

Array.prototype.tail = function <T = any>(): T {
  return this.at(this.tailIndex());
};

Array.prototype.tailIndex = function () {
  return this.length - 1;
};

export {};
