// @ts-check

/**
 * 
 * @returns {string}
 */
export function createUUID() {
  const numberOfDigits = 6;

  return Math.floor(Math.random() * 10 * numberOfDigits).toString(36).padStart(numberOfDigits, "0");
}
