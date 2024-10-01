import packageJson from "../package.json" with { type: 'json' };

const tmLanguage = {
  name: packageJson.contributes.languages[0].id,
  scopeName: packageJson.contributes.grammars[0].scopeName,
  patterns: [
    { include: "#comment" },
    { include: "#uri" },
    { include: "#header-field" },
  ],
  repository: {
    comment: {
      name: "comment.line.headers",
      begin: /\#/, // First '#' in a line
      end: /\Z/,
    },
    uri: {
      name: "meta.uri.headers",
      begin: /^\s*(\/)/, // Line that starts with '/' (possibly with leading spaces)
      end: /\s*\Z/,
      patterns: [{ include: "#placeholder" }, { include: "#wildcard" }],
    },
    wildcard: {
      name: "string.other.headers",
      // Wildcards (*) can be used at any place inside of a path segment to match any character.
      match: /(\*)/,
    },
    placeholder: {
      name: "markup.italic.headers",
      // Placeholders (:placeholders) can only be used at the start of a path segment.
      // Check that there is a leading '/' and either trailing '/' or whitespace.
      match: /(?<=[\/])(:)([-\w]+)(?=(?:[ \t\/]|\Z))/,
      captures: {
        1: { name: "markup.placeholder.colon.headers" },
        2: { name: "markup.placeholder.headers" },
      },
    },
    'header-field': {
      // header name
      begin: /([\w-]+)\s*(:)\s*/,
      end: /(?<=\S)(?<!:)|$/,
      captures: {
        1: {
          name: "variable.other.key.headers"
        },
        2: {
          name: "punctuation.separator.key-value.headers" // The ':' character
        }
      },
      patterns: [
        { include: "#header-value" }
      ]
    },
    'header-value': {
      name: 'string.unquoted.headers',
      match: /\G(.+)/,
    }
  },
};

export default tmLanguage;
