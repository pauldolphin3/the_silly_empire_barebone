interface JaroWinklerCalculator {
  calculate(stringA: string, stringB: string): number;
  preprocess(str: string): string;
  similarCharMappings: Record<string, string>;
}

const jaroWinkler: JaroWinklerCalculator = {
  calculate(stringA: string, stringB: string): number {
    stringA = this.preprocess(stringA);
    stringB = this.preprocess(stringB);

    if (stringA.length <= 0 || stringB.length <= 0) {
      return 0.0;
    }

    const lengthA = stringA.length;
    const lengthB = stringB.length;
    const matchedA: (number | undefined)[] = [];
    const matchedB: (number | undefined)[] = [];
    const searchRange = Math.floor(Math.max(lengthA, lengthB) / 2) - 1;
    const minLength = Math.min(lengthA, lengthB);

    // Find matching characters within search range
    let commonChars = 0;
    const maxIndexB = lengthB - 1;

    for (let i = 0; i < lengthA; i++) {
      const lowerBound = i >= searchRange ? i - searchRange : 0;
      const upperBound =
        i + searchRange <= maxIndexB ? i + searchRange : maxIndexB;
      for (let j = lowerBound; j <= upperBound; j++) {
        if (matchedB[j] !== 1 && stringA[i] === stringB[j]) {
          matchedA[i] = 1;
          matchedB[j] = 1;
          commonChars++;
          break;
        }
      }
    }

    if (commonChars === 0) {
      return 0.0;
    }

    // Count transpositions
    let currentPos = 0;
    let transpositions = 0;
    for (let i = 0; i < lengthA; i++) {
      if (matchedA[i] === 1) {
        let j: number;
        for (j = currentPos; j < lengthB; j++) {
          if (matchedB[j] === 1) {
            currentPos = j + 1;
            break;
          }
        }
        if (stringA[i] !== stringB[j]) {
          transpositions++;
        }
      }
    }
    transpositions = Math.floor(transpositions / 2);

    // Count similar character adjustments
    let similarChars = 0;
    const charMappings = jaroWinkler.similarCharMappings;
    if (minLength > commonChars) {
      for (let i = 0; i < lengthA; i++) {
        if (!matchedA[i]) {
          for (let j = 0; j < lengthB; j++) {
            if (!matchedB[j]) {
              if (charMappings[stringA[i]] === stringB[j]) {
                similarChars += 3;
                matchedB[j] = 2;
                break;
              }
            }
          }
        }
      }
    }
    const totalSimilarity = similarChars / 10.0 + commonChars;

    // Calculate Jaro similarity
    let weight =
      totalSimilarity / lengthA +
      totalSimilarity / lengthB +
      (commonChars - transpositions) / commonChars;
    weight = weight / 3;

    // Apply Winkler prefix boost
    if (weight > 0.7) {
      const prefixLength = minLength >= 4 ? 4 : minLength;
      let commonPrefix: number;
      for (
        commonPrefix = 0;
        commonPrefix < prefixLength &&
        stringA[commonPrefix] === stringB[commonPrefix];
        commonPrefix++
      ) {}
      if (commonPrefix) {
        weight += commonPrefix * 0.1 * (1.0 - weight);
      }

      // Long string adjustment
      if (
        minLength > 4 &&
        commonChars > commonPrefix + 1 &&
        2 * commonChars >= minLength + commonPrefix
      ) {
        weight +=
          (1 - weight) *
          ((commonChars - commonPrefix - 1) /
            (lengthA * lengthB - commonPrefix * 2 + 2));
      }
    }

    return weight;
  },

  preprocess(str: string): string {
    return str
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .toUpperCase();
  },

  similarCharMappings: {
    A: "E",
    B: "V",
    E: "I",
    I: "O",
    O: "U",
    W: "U",
    X: "K",
    S: "Z",
    Q: "C",
    M: "N",
    L: "I",
    P: "R",
    C: "G",
    G: "J",
    Y: " ",
    "2": "Z",
    "5": "S",
    "8": "B",
    "1": "I",
    "0": "O",
  },
};

export default jaroWinkler;
