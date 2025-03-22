/**
 * Adds additional methods to the global Number type
 */
declare global {
  interface Number {
    /**
     * Adds one or more numbers to the current value
     * @param numbers - List of numbers to add
     * @returns The sum as a Number
     */
    add: (...numbers: number[]) => Number;

    /**
     * Calculates the value before taxes by removing layered taxes
     * @param level2TaxRate - Level 2 tax rate (in decimal)
     * @param level1TaxRates - Level 1 tax rates (in decimal)
     * @returns The value before taxes as a Number
     */
    beforeTaxes: (level2TaxRate: number, ...level1TaxRates: number[]) => Number;

    /**
     * Clamps the current value between a minimum and maximum value
     * @param min - Minimum allowed value
     * @param max - Maximum allowed value
     * @returns The clamped value as a Number
     */
    clamp: (min: number, max: number) => Number;

    /**
     * Divides the current value by the given number
     * @param number - The divisor
     * @returns The quotient as a Number
     */
    divide: (number: number) => Number;

    /**
     * Formats the current value as a currency string
     * @param symbol - Currency symbol (default: "$")
     * @param decimalPlaces - Number of decimal places (default: 2)
     * @returns Formatted currency string
     */
    formatCurrency: (symbol: string, decimalPlaces: number) => string;

    /**
     * Calculates a percentage of the current value
     * @param fraction - Decimal fraction to calculate
     * @returns The percentage result as a Number
     */
    percent: (fraction: number) => Number;

    /**
     * Distributes the current value according to given fractions
     * @param fractions - List of fractions for distribution
     * @returns Array of distributed values
     */
    distribute: (...fractions: number[]) => Number[];

    /**
     * Multiplies the current value by one or more numbers
     * @param numbers - List of numbers to multiply
     * @returns The product as a Number
     */
    product: (...numbers: number[]) => Number;

    /**
     * Rounds the current value to a specified number of decimal places
     * @param decimalPlaces - Number of decimal places
     * @returns The rounded value as a Number
     */
    roundTo: (decimalPlaces: number) => Number;

    /**
     * Subtracts one or more numbers from the current value
     * @param numbers - List of numbers to subtract
     * @returns The difference as a Number
     */
    subtract: (...numbers: number[]) => Number;

    /**
     * Executes a function the number of times specified by the current value
     * @param fn - Function to execute with index and total
     * @returns The current value
     */
    times: (fn: (i: number, t: number) => any) => Number;

    /**
     * Transforms the current value into an array with transformation
     * @param fn - Transform function for each element
     * @returns Array of transformed values
     */
    toArray: <T = unknown>(
      fn: (value: Number, index: number, array: Number[]) => T
    ) => T[];

    /**
     * Adds taxes to the current value
     * @param numbers - List of tax rates (in decimal)
     * @returns The value after taxes as a Number
     */
    withTaxes: (...numbers: number[]) => Number;

    /**
     * Converts the current value to a hexadecimal string
     * @param padding - Number of leading zeros (optional)
     * @returns Hexadecimal string
     */
    toHexString(padding?: number): string;
  }
}

Number.prototype.add = function (...numbers: number[]) {
  let total = this as number;
  for (var i = 0; i < numbers.length; i++) {
    total = total + numbers[i];
  }
  return Number(total);
};

Number.prototype.beforeTaxes = function (level2TaxRate, ...level1TaxRates) {
  let originalValue = this.valueOf();

  // Reverse the level 2 tax
  originalValue /= 1 + level2TaxRate;

  // Reverse the level 1 taxes
  for (const rate of level1TaxRates.reverse()) {
    originalValue /= 1 + rate;
  }

  return Number(originalValue);
};

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this.valueOf(), min), max);
};

Number.prototype.divide = function (number: number) {
  return Number(this.valueOf() / number);
};

Number.prototype.formatCurrency = function (symbol = "$", decimalPlaces = 2) {
  return (
    symbol + this.toFixed(decimalPlaces).replace(/\d(?=(\d{3})+\.)/g, "$&,")
  );
};

Number.prototype.percent = function (fraction) {
  return Number(this.valueOf() * fraction);
};

Number.prototype.distribute = function (...percentages) {
  const totalPercentage = percentages.reduce(
    (sum, percent) => sum + percent,
    0
  );
  const distribution: number[] = [];
  const total = this.valueOf();
  let remaining = this.valueOf();

  percentages.forEach((percent, index) => {
    const share = Math.floor((total * percent) / totalPercentage);
    distribution.push(share);
    remaining -= share;

    // Add the remaining fraction to the last element
    if (index === percentages.length - 1) {
      distribution[index] += remaining;
    }
  });

  return distribution.map((x) => Number(x));
};

Number.prototype.product = function (...numbers: number[]) {
  let total = this as number;
  for (var i = 0; i < numbers.length; i++) {
    total = total * numbers[i];
  }
  return Number(total);
};

Number.prototype.roundTo = function (decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(this.valueOf() * factor) / factor;
};

Number.prototype.subtract = function (...numbers: number[]) {
  let total = this as number;
  for (var i = 0; i < numbers.length; i++) {
    total = total - numbers[i];
  }
  return Number(total);
};

Number.prototype.times = function (fn) {
  for (let i = 0; i < Math.floor(this as number); i++) {
    fn(i, this as number);
  }
  return this;
};

Number.prototype.toArray = function (fn) {
  return Array(this).fill(0).map(fn);
};

Number.prototype.withTaxes = function (...taxRates) {
  return Number(
    taxRates.reduce((total, rate) => total + total * rate, this.valueOf())
  );
};

Number.prototype.toHexString = function (padding?: number): string {
  let hex = this.toString(16);
  if (padding) {
    while (hex.length < padding) {
      hex = "0" + hex;
    }
  }
  return hex;
};

export {};
