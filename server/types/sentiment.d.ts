// This file tells TypeScript about the structure of the 'sentiment' JavaScript library.

// Declare the module name as it's used in 'import' statements
declare module 'sentiment' {
  // Define the structure of the object returned by the analyze function
  export interface SentimentResult {
    score: number; // Overall sentiment score
    comparative: number; // Comparative score per word
    calculation: any[]; // Internal calculation details
    tokens: string[]; // List of words (tokens) analyzed
    words: string[]; // List of words found in the sentiment lexicon
    positive: string[]; // List of positive words found
    negative: string[]; // List of negative words found
  }

  // Define the main class provided by the library
  export default class Sentiment {
    /**
     * Analyzes the sentiment of a given phrase.
     * @param phrase The text to analyze.
     * @param options Optional configuration.
     * @param callback Optional callback function.
     * @returns The sentiment analysis result.
     */
    analyze(phrase: string, options?: any, callback?: (err: any, result: SentimentResult) => void): SentimentResult;

    // You could add declarations for other functions if the library has them
    // e.g., registerLanguage(...)
  }
}
