import { ObservableValue } from "./ObservableValue"; // Import the latest ObservableValue

/**
 * Creates a new ObservableValue whose value is computed from one or more
 * other ObservableValue instances.  The computed value is updated automatically
 * whenever any of the input observables change.
 *
 * @template T The type of the values from the source observables.
 * @template V The type of the computed value.
 * @param observables An array of ObservableValue instances to derive the computed value from.
 * @param transform A function that takes the values from the input observables
 * and returns the computed value.
 * @returns A new ObservableValue instance that holds the computed value.
 */

export interface ComputedValue<V> extends ObservableValue<V> {
  unsubscribeSources: () => void;
}

export function computed<T extends any[], V>(
  observables: readonly [...ObservableValue<T[number]>[]], // Use readonly tuple
  transform: (...values: T) => V
): ComputedValue<V> {
  // Extend the return type

  // Get initial values.
  const initialValues = observables.map((obs) => obs.value) as T;

  // Create the new ObservableValue to hold the computed value.
  const computed$ = new ObservableValue<V>(transform(...initialValues));

  // Subscribe to changes in the input observables.
  const unsubscribeFunctions: (() => void)[] = [];
  observables.forEach((obs, index) => {
    const unsubscribe = obs.subscribe(() => {
      // Re-calculate the computed value when any input observable changes.
      const currentValues = observables.map((o) => o.value) as T;
      computed$.value = transform(...currentValues);
    });
    unsubscribeFunctions.push(unsubscribe);
  });

  // Store the unsubscribe functions on the computed$ instance.
  const unsubscribeSources = () => {
    // Define the function
    unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
  };

  // Add the unsubscribeSources function to the computed$ object.
  (computed$ as any).unsubscribeSources = unsubscribeSources;

  // Return the new ObservableValue.
  return computed$ as ComputedValue<V>; // Return the intersection type
}
