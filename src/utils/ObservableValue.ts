import { EventEmitter } from "./Event"; // Import the EventEmitter

/**
 * Represents an observable value, similar to a Signal or RxJS BehaviorSubject.
 *
 * @template T The type of the value being observed.
 */
export class ObservableValue<T> {
  private _value: T; // The current value.
  private _emitter: EventEmitter<{ change: [T] }>; // EventEmitter for 'change' event.

  /**
   * Creates a new ObservableValue.
   *
   * @param initialValue The initial value of the observable.
   */
  constructor(initialValue: T) {
    this._value = initialValue;
    this._emitter = new EventEmitter<{ change: [T] }>();
  }

  /**
   * Gets the current value.
   *
   * @returns The current value of the observable.
   */
  public get value(): T {
    return this._value;
  }

  /**
   * Sets the current value.
   *
   * @param newValue The new value to set.
   * @emits 'change' event with the new value.
   */
  public set value(newValue: T) {
    if (newValue !== this._value) {
      // Only emit if the value has changed.
      this._value = newValue;
      this._emitter.emit("change", newValue); // Emit the 'change' event.
    }
  }

  /**
   * Updates the value and emits change event directly
   * @param newValue The new value to set
   */
  public updateValue(newValue: T): void {
    if (newValue !== this._value) {
      this._value = newValue;
      this._emitter.emit("change", newValue);
    }
  }

  /**
   * Subscribes to changes in the value.
   *
   * @param listener The function to be called when the value changes.
   * @returns A function to unsubscribe from changes.
   */
  public subscribe(listener: (newValue: T) => void): () => void {
    this._emitter.on("change", listener);
    return () => this._emitter.off("change", listener); // Return unsubscribe function.
  }

  /**
   * Adds a listener that will be called once when the value changes
   * @param listener The function to be called when the value changes
   */
  public subscribeOnce(listener: (newValue: T) => void): void {
    this._emitter.once("change", listener);
  }
}
