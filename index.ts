import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

let word = chooseRandomWord();
serve(handler);

async function handler(_req: Request): Promise<Response> {
  if (!_req.body) {
    return new Response("No text found");
  }

  const slackPayload = await _req.formData();
  const text = slackPayload.get("text")?.toString();

  if (!text) {
    return new Response("No text found");
  }

  const response = await evaluateGuess(text.toLowerCase());

  return new Response(response);
}

async function compareWordsSemantically(word1: string, word2: string) {
  const body = {
    sim1: word1,
    sim2: word2,
    lang: "fr",
    type: "General Word2Vec",
  };
  const similarityResponse = await fetch(
    "http://nlp.polytechnique.fr/similarityscore",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const similarityResponseJson = await similarityResponse.json();
  return Number(similarityResponseJson.simscore);
}

function chooseRandomWord() {
  const words = ["voiture", "maison", "chien", "chat", "ordinateur", "table"];
  return randomChoice(words);
}

function randomChoice<T>(array: T[]) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

async function evaluateGuess(guess: string) {
  if (guess === word) {
    word = chooseRandomWord();
    return "You win! Choosing a new word...";
  }
  const score = await compareWordsSemantically(word, guess);
  return `You guessed ${guess}. Similarity score: ${score}. Try again!`
}