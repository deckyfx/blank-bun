/**
 * Global type declarations for String prototype extensions
 */
declare global {
  interface String {
    /**
     * Capitalizes the first character of the string
     * @returns A new string with the first character capitalized
     */
    capitalize(): string;

    /**
     * Converts the string to kebab-case format
     * @returns A new string in kebab-case format
     */
    toKebabCase(): string;

    /**
     * Converts the string to PascalCase format
     * @returns A new string in PascalCase format
     */
    toPascalCase(): string;

    /**
     * Converts the string to camelCase format
     * @returns A new string in camelCase format
     */
    toCamelCase(): string;

    /**
     * Converts the string to snake_case format
     * @returns A new string in snake_case format
     */
    toSnakeCase(): string;

    /**
     * Converts the string to a number
     * @returns The string converted to a number
     */
    toNumber(): number;

    /**
     * Converts the string to a Date object
     * @returns A Date object if the string is a valid date, null otherwise
     */
    toDate(): Date | null;

    /**
     * Truncates the string to a specified length
     * @param maxLength - The maximum length of the resulting string
     * @param ellipsis - The string to append if truncation occurs (default: "...")
     * @returns A truncated string if longer than maxLength, otherwise the original string
     */
    truncate(maxLength: number, ellipsis?: string): string;

    /**
     * Removes all whitespace from the string
     * @returns A new string with all whitespace removed
     */
    removeWhitespace(): string;

    /**
     * Reverses the characters in the string
     * @returns A new string with characters in reverse order
     */
    reverse(): string;

    /**
     * Checks if the string is a valid email address
     * @returns true if the string is a valid email address, false otherwise
     */
    isEmail(): boolean;

    /**
     * Checks if the string is a valid URL
     * @returns true if the string is a valid URL, false otherwise
     */
    isUrl(): boolean;

    /**
     * Checks if the string can be converted to a number
     * @returns true if the string represents a valid number, false otherwise
     */
    isNumberText(): boolean;

    /**
     * Checks if the string contains a specified substring
     * @param substring - The substring to search for
     * @returns true if the substring is found, false otherwise
     */
    contains(substring: string): boolean;
  }
}

/**
 * String prototype extensions module
 * This module extends the native String prototype with additional utility methods
 * for string manipulation and validation.
 * @module String
 */

/**
 * Capitalizes the first character of the string
 * @example
 * "hello".capitalize() // returns "Hello"
 */
String.prototype.capitalize = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Converts the string to kebab-case format
 * @example
 * "helloWorld".toKebabCase() // returns "hello-world"
 */
String.prototype.toKebabCase = function (): string {
  return this.replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

/**
 * Truncates the string if it exceeds the maximum length
 * @param maxLength - The maximum length of the resulting string
 * @param ellipsis - The string to append if truncation occurs (default: "...")
 * @example
 * "hello world".truncate(8) // returns "hello..."
 */
String.prototype.truncate = function (
  maxLength: number,
  ellipsis = "..."
): string {
  if (this.length <= maxLength) {
    return this.toString();
  }
  return this.substring(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Removes all whitespace characters from the string
 * @example
 * "hello world".removeWhitespace() // returns "helloworld"
 */
String.prototype.removeWhitespace = function (): string {
  return this.replace(/\s/g, "");
};

/**
 * Reverses all characters in the string
 * @example
 * "hello".reverse() // returns "olleh"
 */
String.prototype.reverse = function (): string {
  return this.split("").reverse().join("");
};

/**
 * Validates if the string is a valid email address using regex
 * @example
 * "user@example.com".isEmail() // returns true
 */
String.prototype.isEmail = function (): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(this.toString());
};

/**
 * Validates if the string is a valid URL by attempting to construct a URL object
 * @example
 * "https://example.com".isUrl() // returns true
 */
String.prototype.isUrl = function (): boolean {
  try {
    new URL(this.toString());
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Checks if the string contains a specified substring
 * @example
 * "hello world".contains("world") // returns true
 */
String.prototype.contains = function (substring: string): boolean {
  return this.indexOf(substring) !== -1;
};

/**
 * Checks if the string can be converted to a valid number
 * @example
 * "123".isNumberText() // returns true
 * "12.34".isNumberText() // returns true
 * "abc".isNumberText() // returns false
 */
String.prototype.isNumberText = function (): boolean {
  return !isNaN(Number(this.toString()));
};

/**
 * Converts the string to PascalCase format
 * @example
 * "hello world".toPascalCase() // returns "HelloWorld"
 */
String.prototype.toPascalCase = function (): string {
  return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return word.toUpperCase();
  }).replace(/\s+/g, "");
};

/**
 * Converts the string to camelCase format
 * @example
 * "Hello World".toCamelCase() // returns "helloWorld"
 */
String.prototype.toCamelCase = function (): string {
  return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, "");
};

/**
 * Converts the string to snake_case format
 * @example
 * "helloWorld".toSnakeCase() // returns "hello_world"
 */
String.prototype.toSnakeCase = function (): string {
  return this.replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^\s+|[\s-]+/g, "_")
    .replace(/^_|_$/g, "");
};

/**
 * Converts the string to a number
 * @example
 * "123".toNumber() // returns 123
 */
String.prototype.toNumber = function (): number {
  return Number(this.toString());
};

/**
 * Attempts to convert the string to a Date object
 * @example
 * "2024-01-01".toDate() // returns Date object
 * "invalid date".toDate() // returns null
 */
String.prototype.toDate = function (): Date | null {
  const date = new Date(this.toString());
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
};

/**
 * Export an empty object to make this a module
 */
export {};
