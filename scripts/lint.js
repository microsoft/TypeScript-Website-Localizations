// @ts-check
// Loops through all the sample code and ensures that twoslash doesn't raise

// All
// yarn validate-twoslash

// Watcher
// yarn validate-twoslash --watch

// Just italian
// yarn validate-twoslash it/

const chalk = require("chalk");
const { readFileSync, watch } = require("fs");
const { join, basename, sep } = require("path");
const readline = require('readline')

const ts = require("typescript");
const remark = require("remark");
const remarkTwoSlash = require("gatsby-remark-shiki-twoslash");
const { read } = require("gray-matter");
const { recursiveReadDirSync } = require("./recursiveReadDirSync");

const docsPath = join(__dirname, "..", "docs");
const docs = recursiveReadDirSync(docsPath);

const tick = chalk.bold.greenBright("✓");
const cross = chalk.bold.redBright("⤫");

// Pass in a 2nd arg which either triggers watch mode, or to filter which markdowns to run
const filterString = process.argv[2] ? process.argv[2] : "";

if (filterString === "--watch") {
  const clear = () => {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }

  if (process.platform === "linux") throw new Error("Sorry linux peeps, the node watcher doesn't support linux.");
  watch(join(__dirname, "..", "docs"), { recursive: true }, (_, filename) => {
    clear()
    process.stdout.write("♲ ")
    validateAtPaths([join(docsPath, filename)]);
  });
  clear()
  console.log(`${chalk.bold("Started the watcher")}, pressing save on a file in ./docs will lint that file.`);
} else {
  const toValidate = docs
    .filter((f) => !f.includes("/en/"))
    .filter((f) => (filterString.length > 0 ? f.toLowerCase().includes(filterString.toLowerCase()) : true));

  validateAtPaths(toValidate);
}

/** @param {string[]} mdDocs */
function validateAtPaths(mdDocs) {
  let errorReports = [];

  mdDocs.forEach((docAbsPath, i) => {
    const docPath = docAbsPath;
    const filename = basename(docPath);

    let lintFunc = undefined;

    if (docAbsPath.endsWith(".ts")) {
      lintFunc = lintTSLanguageFile;
    } else if (docAbsPath.endsWith(".md")) {
      lintFunc = lintMarkdownFile;
    }

    const isLast = i === mdDocs.length - 1;
    const suffix = isLast ? "" : ", ";

    if (!lintFunc) {
      process.stdout.write(chalk.gray(filename + " skipped" + suffix));
      return;
    }

    const errors = lintFunc(docPath);
    errorReports = errorReports.concat(errors);

    const sigil = errors.length ? cross : tick;
    const name = errors.length ? chalk.red(filename) : filename;

    process.stdout.write(name + " " + sigil + suffix);
  });

  if (errorReports.length) {
    process.exitCode = 1;
    console.log("");

    errorReports.forEach((err) => {
      console.log(`\n> ${chalk.bold.red(err.path)}\n`);
      err.error.stack = undefined;
      console.log(err.error.message);
      if (err.error.stack) {
        console.log(err.error.stack);
      }
    });
    console.log("\n");

    if (!filterString) {
      console.log(
        "Note: you can add an extra argument to the lint script ( yarn workspace glossary lint [opt] ) to just run one lint."
      );
    }
  } else {
    console.log(chalk.green("\n\nAll good"));
  }
}

/** @param {string} docPath  */
function lintMarkdownFile(docPath) {
  /** @type { Error[] } */
  const errors = [];
  const markdown = readFileSync(docPath, "utf8");
  const markdownAST = remark().parse(markdown);
  const greyMD = read(docPath);

  try {
    remarkTwoSlash.runTwoSlashAcrossDocument({ markdownAST }, {});
  } catch (error) {
    errors.push(error);
  }

  const relativePath = docPath.replace(docsPath, "");
  const docType = relativePath.split(sep)[1];
  const lang = relativePath.split(sep)[2];

  if (docType === "documentation") {
    if (!greyMD.data.display) {
      errors.push(new Error("Did not have a 'display' property in the YML header"));
    }

    if (greyMD.data.layout !== "docs") {
      errors.push(new Error("Expected 'layout: docs' in the YML header"));
    }

    if (greyMD.data.permalink.startsWith("/" + lang)) {
      errors.push(new Error(`Expected 'permalink:' in the YML header to start with '/${lang}'`));
    }
  } else if (docType === "tsconfig") {
    if (relativePath.includes("options")) {
      if (!greyMD.data.display) {
        errors.push(new Error("Did not have a 'display' property in the YML header"));
      }

      if (!greyMD.data.display) {
        errors.push(new Error("Did not have a 'oneline' property in the YML header"));
      }
    }
  }

  return errors.map((e) => ({ path: docPath, error: e }));
}

/** @param {string} file */
function lintTSLanguageFile(file) {
  /** @type {{ path: string, error: Error }[]} */
  const errors = [];

  const content = readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    content,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const tooManyStatements = sourceFile.statements.length > 1;
  const notDeclarationList = sourceFile.statements[0].kind !== 232;

  if (tooManyStatements) {
    errors.push({
      path: file,
      error: new Error("TS files had more than one statement (e.g. more than `export const somethingCopy = { ... }` "),
    });
  }

  if (notDeclarationList) {
    errors.push({
      path: file,
      error: new Error("TS files should only look like: `export const somethingCopy = { ... }` "),
    });
  }

  return errors;
}
