export type TaskFunction<
  Result = void,
  Arguments extends any[] = []
> = Arguments extends any[]
  ? (...args: [...Arguments, Task<Result, Arguments>]) => Promise<Result>
  : never;

export type Listener<T extends Array<any>> = (...args: T) => void;

export type CustomError = new (message?: string) => Error;

export class CommonError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function catchError<T, E extends CustomError>(
  promise: Promise<T>,
  errors?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      if (errors === undefined) {
        return [error];
      }
      if (errors.some((e) => error instanceof e)) {
        return [error];
      }
      throw error;
    });
}

export function isCustomError(error: unknown): error is CustomError {
  return error instanceof ((message?: string) => Error);
}

export class EventEmitter<EventMap extends Record<string, Array<any>>> {
  private eventListeners: {
    [K in keyof EventMap]?: Set<Listener<EventMap[K]>>;
  } = {};

  on<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>) {
    const listeners = this.eventListeners[eventName] ?? new Set();
    listeners.add(listener);
    this.eventListeners[eventName] = listeners;
  }

  emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
    const listeners = this.eventListeners[eventName] ?? new Set();
    for (const listener of listeners) {
      listener(...args);
    }
  }
}

export type TaskEvents<Result> = {
  start: [Task];
  done: [Task, Result];
  error: [Task, Error];
  data: [any];
};

export class Task<
  Result = void,
  Arguments extends any[] = []
> extends EventEmitter<TaskEvents<Result>> {
  public result!: Result;
  public readonly controller!: AbortController;
  public _meta: {
    executed: boolean;
    has_error: boolean;
  } = { executed: false, has_error: false };

  constructor(private handler: TaskFunction<Result, Arguments>) {
    super();
    this.controller = new AbortController();
  }

  async run(scope: any = null, ...args: Arguments): Promise<Result> {
    const new_args = [...args, this] as [
      ...Arguments[],
      Task<Result, Arguments>
    ];
    this.emit("start", this as any);

    const [error, result] = await catchError(
      this.handler.call(scope, ...new_args)
    );

    this._meta.executed = true;
    if (error) {
      this._meta.has_error = true;
      this.emit("error", this as any, error);
      throw error;
    }
    this.result = result;
    this.emit("done", this as any, result);
    return this.result;
  }

  abort(safe?: boolean) {
    this._meta.executed = true;
    if (safe) {
      this.controller.abort();
      return;
    }
    this._meta.has_error = true;
    this.controller.abort();
    this.emit("error", this as any, new Error("abborted"));
  }

  get signal() {
    return this.controller.signal;
  }

  static create<Result = void, Arguments extends any[] = []>(
    func: TaskFunction<Result, Arguments>
  ) {
    return new Task<Result, Arguments>(func);
  }
}
