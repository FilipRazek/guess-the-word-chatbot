import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

let word = chooseRandomWord();
serve(handler);

async function handler(_req: Request): Promise<Response> {
  if (!_req.body) {
    return new Response("No text found");
  }

  const sentValue = await readStream(_req.body);
  const text = extractParameter(sentValue, "text");

  if (!text) {
    return new Response("No text found");
  }

  const response = evaluateGuess(text.toLowerCase());

  return new Response(response);
}

async function readStream(stream: ReadableStream<Uint8Array>) {
  let result = "";
  const reader = stream?.getReader();
  const utf8Decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader?.read();
    if (done) {
      break;
    }
    const decodedBody = utf8Decoder.decode(value, { stream: true });
    result += decodedBody;
  }
  return result;
}

function extractParameter(urlQuery: string, parameter: string) {
  const query = new URLSearchParams(urlQuery);
  return query.get(parameter);
}

function compareWordsSemantically(word1: string, word2: string) {
  return Math.random();
}

function chooseRandomWord() {
  const words = ["infrastructure", "devops", "cloud", "serverless"]
  return randomChoice(words);
}

function randomChoice<T>(array: T[]) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function evaluateGuess(guess: string) {
  if (guess === word) {
    word = chooseRandomWord();
    return "You win! Choosing a new word...";
  }
  const score = compareWordsSemantically(word, guess);
  return `You guessed ${guess}. The correct word was ${word}. Similarity score: ${Math.floor(score * 100)}%. Try again!`
}