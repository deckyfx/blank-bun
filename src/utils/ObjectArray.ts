/**
 * A custom Array class that extends the native Array to handle objects with primary keys
 * @template T - Type of objects stored in the array, must be a Record with string keys
 * @extends {Array<T>}
 */
export default class ObjectArray<
  T extends Record<string, any> = {}
> extends Array<T> {
  private _primaryKeyField: string;

  /**
   * Creates a new instance of ObjectArray
   * @param {T[]} members - Initial array of objects to populate the array
   */
  constructor(members: T[] = []) {
    super(...members);
    this._primaryKeyField = "_id";
  }

  /**
   * Gets the current primary key field name
   * @returns {keyof T} The name of the primary key field
   */
  get primaryKeyField() {
    return this._primaryKeyField as keyof T;
  }

  /**
   * Sets the primary key field name
   * @param {keyof T} key - The name of the field to use as primary key
   * @throws {Error} If the key is not a string
   */
  set primaryKeyField(key: keyof T) {
    if (typeof key !== "string") {
      throw new Error("Primary key field must be a string");
    }
    this._primaryKeyField = key;
  }

  /**
   * Finds an object in the array by its primary key value
   * @param {string | number | Symbol} primaryKey - The value of the primary key to search for
   * @returns {T | undefined} The found object or undefined if not found
   */
  _find(primaryKey: string | number | Symbol): T | undefined {
    return this.find((item) => item[this.primaryKeyField] === primaryKey);
  }

  /**
   * Sorts the array based on the primary key values
   * Handles both numeric and string/symbol comparisons
   * @returns {this} The sorted array instance
   */
  _sort(): this {
    this.sort((a, b) => {
      const aValue = a[this.primaryKeyField];
      const bValue = b[this.primaryKeyField];

      // Compare based on the type of the primary key
      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      } else {
        return aValue.toString().localeCompare(bValue.toString());
      }
    });
    return this;
  }
}
