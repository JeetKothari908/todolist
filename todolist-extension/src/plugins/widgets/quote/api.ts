import { API } from "../../types";
import { quotes } from "./quotes";
import { Quote } from "./types";

export async function getQuote(
  loader: API["loader"],
  _category: string,
): Promise<Quote> {
  loader.push();

  const today = new Date();
  const dayKey = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const dayIndex = Math.floor(dayKey / 86400000);
  const quoteIndex = Math.abs(dayIndex) % quotes.length;
  const data = quotes[quoteIndex];

  loader.pop();

  return {
    author: data.author,
    quote: cleanQuote(data.quote),
    timestamp: Date.now(),
  };
}

function cleanQuote(quote: string) {
  quote = quote.trim();

  const spaces = new RegExp(/\s{2,}/, "g");
  quote = quote.replace(spaces, " ");

  return quote;
}
