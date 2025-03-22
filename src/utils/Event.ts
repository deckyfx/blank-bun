/**
 * Type-safe EventEmitter implementation for TypeScript.
 *
 * This class provides a way to subscribe to and emit events with type safety,
 * similar to the built-in EventEmitter in Node.js, but without relying on any
 * platform-specific dependencies, making it suitable for use in various
 * environments (e.g., browser, Node.js, embedded systems).
 *
 * It uses a generic type `EventMap` to define the structure of events and
 * their associated arguments.
 */
export class EventEmitter<EventMap extends Record<string | symbol, any[]>> {
  // Use a Map to store event listeners.
  private _listeners: Map<
    keyof EventMap,
    ((...args: EventMap[keyof EventMap]) => void)[]
  > = new Map();

  /**
   * Creates a new EventEmitter instance.
   */
  constructor() {}

  /**
   * Adds a listener function to the specified event.
   *
   * @param event The name of the event to subscribe to.
   * @param listener The function to be called when the event is emitted.
   * @returns      The EventEmitter instance, allowing for chaining
   * of method calls.
   */
  public on<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): this {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    const listeners = this._listeners.get(event)!;
    listeners.push(listener as (...args: any[]) => void); // Type assertion here
    return this;
  }

  /**
   * Alias for `on`.  Adds a listener function to the specified event.
   *
   * @param event The name of the event to subscribe to.
   * @param listener The function to be called when the event is emitted.
   * @returns      The EventEmitter instance.
   */
  public addListener<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): this {
    return this.on(event, listener);
  }

  /**
   * Removes a listener function from the specified event.
   *
   * @param event The name of the event to unsubscribe from.
   * @param listener The function to be removed.
   * @returns      The EventEmitter instance.
   */
  public off<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): this {
    if (this._listeners.has(event)) {
      const listeners = this._listeners.get(event)!;
      const newListeners = listeners.filter((l) => l !== listener);
      if (newListeners.length > 0) {
        this._listeners.set(event, newListeners);
      } else {
        this._listeners.delete(event);
      }
    }
    return this;
  }

  /**
   * Alias for `off`.  Removes a listener function from the specified event.
   *
   * @param event The name of the event to unsubscribe from.
   * @param listener The function to be removed.
   * @returns      The EventEmitter instance.
   */
  public removeListener<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): this {
    return this.off(event, listener);
  }

  /**
   * Removes all listeners, or those of the specified event.
   *
   * @param event The name of the event to remove listeners from.
   * If not provided, all listeners for all events will be removed.
   * @returns The EventEmitter instance.
   */
  public removeAllListeners<K extends keyof EventMap>(event?: K): this {
    if (event === undefined) {
      this._listeners.clear();
    } else {
      this._listeners.delete(event);
    }
    return this;
  }

  /**
   * Emits an event, calling all subscribed listeners with the provided arguments.
   *
   * @param event The name of the event to emit.
   * @param args  The arguments to pass to the listener functions.
   * @returns     True if the event had listeners, false otherwise.
   */
  public emit<K extends keyof EventMap>(
    event: K,
    ...args: EventMap[K]
  ): boolean {
    if (!this._listeners.has(event)) {
      return false;
    }
    const listeners = this._listeners.get(event)!;
    for (const listener of listeners) {
      listener(...args);
    }
    return true;
  }

  /**
   * Returns the number of listeners for the specified event.
   *
   * @param event The name of the event to query.
   * @returns The number of listeners for the event.
   */
  public listenerCount<K extends keyof EventMap>(event: K): number {
    if (!this._listeners.has(event)) {
      return 0;
    }
    const listeners = this._listeners.get(event)!;
    return listeners.length;
  }
  /**
   * Returns an array of listeners for the specified event.
   *
   * @param event The name of the event.
   * @returns An array of listeners or an empty array if there are no listeners.
   */
  public listeners<K extends keyof EventMap>(
    event: K
  ): ((...args: EventMap[K]) => void)[] {
    if (!this._listeners.has(event)) {
      return [];
    }
    return [...this._listeners.get(event)!] as ((
      ...args: EventMap[K]
    ) => void)[];
  }

  /**
   * Adds a listener that will be invoked a single time when the event
   * is fired.  After the listener is called, it will be removed.
   *
   * @param event The name of the event to listen to.
   * @param listener The callback function to be invoked.
   * @returns The EventEmitter instance.
   */
  public once<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): this {
    const onceListener = (...args: EventMap[K]) => {
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
    return this;
  }
}
