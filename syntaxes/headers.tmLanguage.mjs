const END_OF_LINE = /\Z/;

const tmLanguage = {
  name: "Headers",
  patterns: [
    { include: "#comment" },
    { include: "#uri" },
    { include: "#header" },
  ],
  repository: {
    comment: {
      name: "comment.line.headers",
      begin: /\#/, // First '#' in a line
      end: END_OF_LINE,
    },
    uri: {
      name: "meta.uri.headers",
      begin: /^\s*\//, // Line that starts with '/' (possibly with leading spaces)
      end: END_OF_LINE,
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
      match: /(?<=[\/=])(\:)(\w+)(?=(?:\s\Z))/,
      captures: {
        1: { name: "markup.placeholder.colon.headers" },
        2: { name: "markup.placeholder.headers" },
      },
    },
    header: {
      name: "meta.structure.dictionary.value.headers",
      // Entire line that contains a colon (:)
      match: /^\s*([\w-]+)\s*(:)\s*(.+)([,;]?)\s*/,
      captures: {
        1: { name: "entity.name.type.headers" },
        2: { name: "punctuation.separator.key-value.headers" }, // The ':' character
        3: { name: "string.unquoted.headers" },
        4: { name: "punctuation.separator.headers" }, // ',' or ';' at the end of the line
      },
    },
  },
};

export default tmLanguage;
