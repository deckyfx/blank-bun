// @ts-ignore
// import * as React from "react";

const React: any = null;

const useState: <T>(v: T) => [any, any] = React
  ? React.useState
  : function useState<T>(initialValue: T): [any, any] {
      throw new Error("Function not implemented.");
    };

const useEffect = React
  ? React.useEffect
  : function useEffect<T>(arg0: () => () => void, arg1: ObservableValue<T>[]) {
      throw new Error("Function not implemented.");
    };

import { ObservableValue } from "./ObservableValue"; // Import ObservableValue

// Queue untuk menyimpan update yang akan di-batch
const updateQueue = new Set<ObservableValue<any>>();
let isBatching = false;

/**
 * Menjalankan fungsi update dalam mode batch
 * Semua update state yang terjadi di dalam fungsi akan digabungkan menjadi satu update
 *
 * @param updateFn - Fungsi yang berisi update state
 */
export function batchUpdate<T>(updateFn: () => T): T {
  try {
    isBatching = true;
    return updateFn();
  } finally {
    isBatching = false;
    // Proses semua update yang tertunda
    for (const observable of updateQueue) {
      observable.updateValue(observable.value); // Trigger change event
    }
    updateQueue.clear();
  }
}

/**
 * Creates a signal that can work both as a normal JavaScript observable and as a React state manager.
 * When used inside a React component, it will automatically trigger re-renders.
 * When used outside React, it works as a normal observable value.
 *
 * @template T The type of the signal's value.
 * @param initialValue The initial value of the signal or an ObservableValue instance.
 * @returns An ObservableValue instance that can be used both in React and vanilla JavaScript
 */
export function signal<T>(
  initialValue: T | ObservableValue<T>
): ObservableValue<T> {
  // Jika input adalah ObservableValue, gunakan langsung
  if (initialValue instanceof ObservableValue) {
    const observable = initialValue;
    let currentValue = observable.value;

    // Override the original setter to support batching
    Object.defineProperty(observable, "value", {
      get: () => currentValue,
      set: (newValue: T) => {
        if (newValue !== currentValue) {
          currentValue = newValue;
          if (isBatching) {
            updateQueue.add(observable);
          } else {
            observable.updateValue(newValue);
          }
        }
      },
    });

    // If we're in a React component, set up React state integration
    if (React) {
      const [value, setValue] = useState<T>(observable.value);

      useEffect(() => {
        const unsubscribe = observable.subscribe((newValue: T) => {
          setValue(newValue);
        });
        return unsubscribe;
      }, [observable]);

      // Override the value setter to update both ObservableValue and React state
      Object.defineProperty(observable, "value", {
        get: () => value,
        set: (newValue: T) => {
          if (newValue !== value) {
            currentValue = newValue;
            if (isBatching) {
              updateQueue.add(observable);
            } else {
              observable.updateValue(newValue);
              setValue(newValue);
            }
          }
        },
      });
    }

    return observable;
  }

  // Jika input adalah nilai biasa, buat ObservableValue baru
  const observable = new ObservableValue<T>(initialValue);
  let currentValue = initialValue;

  // Override the original setter to support batching
  Object.defineProperty(observable, "value", {
    get: () => currentValue,
    set: (newValue: T) => {
      if (newValue !== currentValue) {
        currentValue = newValue;
        if (isBatching) {
          updateQueue.add(observable);
        } else {
          observable.updateValue(newValue);
        }
      }
    },
  });

  // If we're in a React component, set up React state integration
  if (React) {
    const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
      const unsubscribe = observable.subscribe((newValue: T) => {
        setValue(newValue);
      });
      return unsubscribe;
    }, [observable]);

    // Override the value setter to update both ObservableValue and React state
    Object.defineProperty(observable, "value", {
      get: () => value,
      set: (newValue: T) => {
        if (newValue !== value) {
          currentValue = newValue;
          if (isBatching) {
            updateQueue.add(observable);
          } else {
            observable.updateValue(newValue);
            setValue(newValue);
          }
        }
      },
    });
  }

  return observable;
}
