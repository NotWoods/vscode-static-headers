// @ts-check
import { writeFile } from "node:fs/promises";
import headerDb from "known-http-header-db";
import tmLanguage from "./syntaxes/headers.tmLanguage.mjs";

/**
 *
 * @param {string} _key
 * @param {unknown} value
 * @returns {string | unknown}
 */
function replaceRegex(_key, value) {
  if (value instanceof RegExp) {
    const regex = value.toString();
    return regex.slice(1, -1); // Removing leading and trailing '/'
  } else {
    return value;
  }
}

function pickHeaderValues() {
  return Object.fromEntries(
    Object.entries(headerDb.default).map(([name, value]) => [
      name,
      {
        description: value.description,
        syntax: value.syntax,
        examples: value.examples,
        link: value.link,
      },
    ])
  );
}

await Promise.all([
  writeFile(
    "./syntaxes/headers.tmLanguage.json",
    JSON.stringify(tmLanguage, replaceRegex, 2)
  ),
  writeFile("./headers.header-data.json", JSON.stringify(pickHeaderValues())),
]);
