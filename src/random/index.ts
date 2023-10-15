/** A cryptographically secure alternative to `Math.random()` */
export function random(): number {
  const randomUint32Values = new Uint32Array(1);
  crypto.getRandomValues(randomUint32Values);
  const u32Max = 0xffffffff; // max uint32 value
  // convert uint32 to floating point between 0 (inclusive) and 1 (exclusive)
  // divide by max + 1 to exclude 1
  return randomUint32Values[0]! / (u32Max + 1);
}

/**
 * Generates a random integer between 2 integers (cryptographically secure)
 * @param min minimum (inclusive)
 * @param max maximum (exclusive)
 * */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor((max - min) * random()) + min;
}

/** Generates a random string of a given length using the provided alphabet (cryptographically secure) */
export function generateRandomString(length: number, alphabet: string) {
  // see `random()` for explanation
  const randomUint32Values = new Uint32Array(length);
  crypto.getRandomValues(randomUint32Values);
  const u32Max = 0xffffffff;
  let result = "";
  for (let i = 0; i < randomUint32Values.length; i++) {
    const rand = randomUint32Values[i]! / (u32Max + 1);
    result += alphabet[Math.floor(alphabet.length * rand)];
  }
  return result;
}

type AlphabetPattern = "a-z" | "A-Z" | "0-9" | "-" | "_";

/** Creates an alphabet string using the provided patterns for `generateRandomString()` etc */
export function alphabet(...patterns: AlphabetPattern[]): string {
  const patternSet = new Set<AlphabetPattern>(patterns);
  let result = "";
  for (const pattern of patternSet) {
    if (pattern === "a-z") {
      result += "abcdefghijklmnopqrstuvwxyz";
    } else if (pattern === "A-Z") {
      result += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    } else if (pattern === "0-9") {
      result += "0123456789";
    } else {
      result += pattern;
    }
  }
  return result;
}
