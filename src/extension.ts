import * as vscode from "vscode";
import { HoverProvider, Hover, TextDocument, Position } from "vscode";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const HEADERS_ID = "headers";
const HEADER_SEPARATOR = ":";

function headersHoverProvider(): HoverProvider {
  let headerDatabasePromise: Promise<string>;
  async function getHeaderDatabase(): Promise<
    import("known-http-header-db").HTTPHeaderDb
  > {
    if (!headerDatabasePromise) {
      headerDatabasePromise = readFile(
        resolve(__dirname, "../headers.header-data.json"),
        "utf-8"
      );
    }

    const headerDatabase = await headerDatabasePromise;
    return JSON.parse(headerDatabase);
  }

  return {
    async provideHover(
      document: TextDocument,
      position: Position
    ): Promise<Hover | undefined> {
      const line = document.lineAt(position.line);
      if (line.isEmptyOrWhitespace) {
        return undefined;
      }

      const trimmedLine = line.text.trim();
      if (
        trimmedLine.startsWith("#") ||
        !trimmedLine.includes(HEADER_SEPARATOR)
      ) {
        return undefined;
      }

      // Copied from Netlify repo (https://github.com/netlify/build/blob/dd8680932f0c02aec5dd6fba0ac43af3347eb213/packages/headers-parser/src/line_parser.ts#L65)
      const [rawName] = trimmedLine.split(HEADER_SEPARATOR, 2);
      const name = rawName.trim().toLowerCase();

      if (name === "") {
        return undefined;
      }

      const headerDb = await getHeaderDatabase();
      const header = headerDb[name];
      if (!header) {
        return undefined;
      }

      const contents = new vscode.MarkdownString(header.description);

      // Code samples
      if (header.examples && header.examples.length > 0) {
        header.examples.forEach((example) => {
          contents.appendCodeblock(example, HEADERS_ID);
        });
      } else if (header.syntax) {
        contents.appendCodeblock(header.syntax, HEADERS_ID);
      }

      // Link
      if (header.link) {
        contents.appendMarkdown(`\n\n[MDN Reference](${header.link})`);
      }

      return {
        contents: [contents],
      };
    },
  };
}

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.languages.registerHoverProvider(HEADERS_ID, headersHoverProvider())
  );
}
