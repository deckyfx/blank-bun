/**
 * Utility functions for handling timers and delays
 */

import type { AbortableFunctionOptions } from "./Common";

/**
 * Creates a promise that resolves after a specified delay
 * @param timer - The delay duration in milliseconds
 * @param opt - Options for making the operation abortable
 * @param opt.signal - An AbortSignal to cancel the sleep operation
 * @returns A promise that resolves after the specified delay
 * @example
 * ```ts
 * // Sleep for 1 second
 * await sleep(1000);
 *
 * // Sleep with abort capability
 * const controller = new AbortController();
 * await sleep(1000, { signal: controller.signal });
 * ```
 */
export async function sleep(timer: number, opt: AbortableFunctionOptions = {}) {
  return new Promise<void>((resolve) => {
    const timeout: Timer = setTimeout(resolve, timer);
    opt.signal?.addEventListener("abort", () => {
      clearTimeout(timeout); // 7
    });
  });
}

/**
 * Executes a function repeatedly at specified intervals
 * @param interval - The interval duration in milliseconds between function executions
 * @param func - The function to execute repeatedly
 * @param opt - Options for making the operation abortable
 * @param opt.signal - An AbortSignal to stop the repeated execution
 * @returns A promise that never resolves (use abort signal to stop)
 * @example
 * ```ts
 * // Execute function every second
 * const controller = new AbortController();
 * await repeat(1000, () => console.log('tick'), { signal: controller.signal });
 * ```
 */
export async function repeat(
  interval: number,
  func: Function,
  opt: AbortableFunctionOptions = {}
) {
  return new Promise<void>((_) => {
    const timeout: Timer = setInterval(() => {
      func();
    }, interval);
    opt.signal?.addEventListener("abort", () => {
      clearTimeout(timeout); // 7
    });
  });
}

/**
 * Creates a debounced version of a function.
 *
 * @param func The function to debounce.
 * @param delay The delay in milliseconds before the debounced function is called.
 * @returns A new function that, when called, will delay the invocation of the
 * original function until after the specified delay has passed since the last
 * call.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timer | null;

  return (...args: Parameters<T>) => {
    // Clear the previous timeout if it exists.
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to call the function after the delay.
    timeoutId = setTimeout(() => {
      func(...args); // Call the original function with the arguments.
      timeoutId = null; // Reset the timeoutId after the function is called.
    }, delay);
  };
}
