import { ObservableValue } from "./ObservableValue"; // Import ObservableValue

/**
 * Creates an effect that is triggered when any of the dependent ObservableValue instances change.
 *
 * @param callback The function to be called when any of the dependencies change.  This can be a regular function or a Promise-returning function.
 * @param dependencies An array of ObservableValue instances that the effect depends on.
 * @returns A function that cleans up all the subscriptions.
 */
export function effect(
  callback: () => void | Promise<void>,
  dependencies: readonly [...ObservableValue<any>[]]
): () => void {
  if (!Array.isArray(dependencies)) {
    throw new TypeError(
      "Dependencies must be an array of ObservableValue instances."
    );
  }

  if (dependencies.length === 0) {
    // If there are no dependencies, the callback should not be executed, and there are no subscriptions to clean up.
    return () => {}; // Return an empty cleanup function.
  }

  // Store the unsubscribe functions for all dependencies.
  const unsubscribeFunctions: (() => void)[] = [];

  // Function to execute the callback.  Now handles Promises.
  const executeCallback = () => {
    const result = callback();
    if (result instanceof Promise) {
      result.catch((error) => {
        console.error("Error in effect callback:", error);
        //  Consider re-throwing the error if you want it to propagate further.
        //  throw error;
      });
    }
  };

  // Subscribe to each dependency and store the unsubscribe function.
  for (const dependency of dependencies) {
    if (!(dependency instanceof ObservableValue)) {
      throw new TypeError(
        "Each dependency must be an instance of ObservableValue."
      );
    }
    const unsubscribe = dependency.subscribe(executeCallback);
    unsubscribeFunctions.push(unsubscribe);
  }

  // Return a cleanup function that unsubscribes from all dependencies.
  return () => {
    for (const unsubscribe of unsubscribeFunctions) {
      unsubscribe();
    }
  };
}
