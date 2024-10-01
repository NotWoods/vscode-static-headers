// @ts-check
import tmLanguage from "./syntaxes/headers.tmLanguage.mjs";
import { writeFileSync } from "fs";

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

writeFileSync(
  "./syntaxes/headers.tmLanguage.json",
  JSON.stringify(tmLanguage, replaceRegex, 2)
);
