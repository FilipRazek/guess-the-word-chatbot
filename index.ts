import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

serve(handler);

async function handler(_req: Request): Promise<Response> {
  if (!_req.body) {
    return new Response("No text found");
  }
  const sentValue = await readStream(_req.body);
  const text = extractParameter(sentValue, "text");
  return new Response(text);
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
