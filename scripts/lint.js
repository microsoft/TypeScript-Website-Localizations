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
const { join, basename, sep, dirname } = require("path");
const readline = require("readline");

const ts = require("typescript");
const remark = require("remark");
const remarkTwoSlash = require("gatsby-remark-shiki-twoslash");
const { read } = require("gray-matter");
const { recursiveReadDirSync } = require("./recursiveReadDirSync");
const { isObjectLiteralExpression } = require("typescript");

const docsPath = join(__dirname, "..", "docs");
const docs = recursiveReadDirSync(docsPath);

const tick = chalk.bold.greenBright("✓");
const cross = chalk.bold.redBright("⤫");

// Pass in a 2nd arg which either triggers watch mode, or to filter which markdowns to run
const filterString = process.argv[2] ? process.argv[2] : "";

if (filterString === "--watch") {
  const clear = () => {
    const blank = "\n".repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  };

  if (process.platform === "linux") throw new Error("Sorry linux peeps, the node watcher doesn't support linux.");
  watch(join(__dirname, "..", "docs"), { recursive: true }, async (_, filename) => {
    clear();
    process.stdout.write("♲ ");
   await validateAtPaths([join(docsPath, filename)]);
  });
  clear();
  console.log(`${chalk.bold("Started the watcher")}, pressing save on a file in ./docs will lint that file.`);
} else {
  const toValidate = docs
    .filter((f) => !f.includes("/en/"))
    .filter((f) => (filterString.length > 0 ? f.toLowerCase().includes(filterString.toLowerCase()) : true)).sort()

  validateAtPaths(toValidate).then(() => console.log("Done"));
}

/** @param {string[]} docs */
async function validateAtPaths(docs) {
  let errorReports = [];

  console.log(`Looking at ~${docs.length} files.`)
  let folder = ""
  for (const docAbsPath of docs) {
    const i = docs.indexOf(docAbsPath);
  
    const docPath = docAbsPath;
    const filename = basename(docPath);

    const components = dirname(docPath).split(sep)
    const offset = components[components.length - 3] === "docs" ? 2 : 3
    const docType =  components[components.length - offset] + sep + components[components.length - offset + 1]
    if(docType && docType !== folder) {
      folder = docType;
      console.log(`\n\n${chalk.bold(docType)}`)
    }

    let lintFunc = undefined;

    if (docAbsPath.includes("typescriptlang") && docAbsPath.endsWith(".ts")) {
      lintFunc = lintTSLanguageFile;
    } else if (docAbsPath.endsWith(".md")) {
      lintFunc = lintMarkdownFile;
    }

    const isLast = i === docs.length - 1;
    const suffix = isLast ? "" : ", ";

    if (!lintFunc) {
      process.stdout.write(chalk.gray(filename + " skipped" + suffix));
      continue;
    }

    const errors = await lintFunc(docPath);
    errorReports = errorReports.concat(errors);

    const sigil = errors.length ? cross : tick;
    const name = errors.length ? chalk.red(filename) : filename;

    process.stdout.write(name + " " + sigil + suffix);
  };

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
async function lintMarkdownFile(docPath) {
  /** @type { Error[] } */
  const errors = [];
  const markdown = readFileSync(docPath, "utf8");
  const markdownAST = remark().parse(markdown);
  const greyMD = read(docPath);

  try {
    // await remarkTwoSlash({ markdownAST }, {});
  } catch (error) {
    errors.push(error);
  }

  const relativePath = docPath.replace(docsPath, "");
  const docType = relativePath.split(sep)[1];
  const lang = relativePath.split(sep)[2];

  if (docType === "documentation") {
    if (!greyMD.data.title) {
      errors.push(new Error("Did not have a 'display' property in the YML header"));
    }

    if (greyMD.data.layout !== "docs") {
      errors.push(new Error("Expected 'layout: docs' in the YML header"));
    }

    if (!greyMD.data.permalink.startsWith("/" + lang)) {
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
  /** @type {Error[]} */
  const errors = [];

  const content = readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    content,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const filename = basename(file, ".ts");
  const lastDir = dirname(file).split(sep).pop();

  if(filename === "en") return []

  const isRootImport = filename === lastDir;
  if (isRootImport) {
    // This is the import for the language which pulls in all the existing messages
    
    try {
      const notImportStatements = sourceFile.statements.filter(t => !ts.isImportDeclaration(t));
      const lastStatementIsDeclaration = ts.isVariableStatement(sourceFile.statements[sourceFile.statements.length - 1])
      const onlyImportsAndOneExport = lastStatementIsDeclaration && notImportStatements.length === 1;
  
      if (!onlyImportsAndOneExport) {
        errors.push(new Error("A root language import can only include imports and an export called 'lang' "));
      }
  
      if (lastStatementIsDeclaration) {
        const lastStatement = notImportStatements[0]
        if(!ts.isVariableStatement(lastStatement)) {
          errors.push(new Error("Last statement in a root language import must be a 'export const lang' ..."));
        } else {
          const declaration = lastStatement.declarationList.declarations[0];
          if (!declaration.initializer) errors.push(new Error(`Something is off with the export in this file`));
    
          const init = declaration.initializer;
          if(!init  || !ts.isCallExpression(init)) {
            errors.push(new Error(`The export needs to call define messages`));

          } else {
            const callExpression = init.expression;
            if (callExpression.getText(sourceFile) !== "defineMessages")
              errors.push(new Error(`The export needs to call define messages`));
      
  
            const arg0 = init.arguments[0];
            if(!ts.isObjectLiteralExpression(arg0)) {
              errors.push(new Error(`The export needs to call define messages with an object literal`));
            } else {
              arg0.properties.forEach((p) => {
                if (!ts.isSpreadAssignment(p)) errors.push(new Error(`You can only have spreads (...) in the export`));
              });
            }
          }

        }
      }
  
      sourceFile.statements.forEach((s) => {
        if (!ts.isImportDeclaration(s)) return;
        if (!s.importClause)
          errors.push(new Error(`The import ${s.moduleSpecifier.getText(sourceFile)} is not importing an object`));
  
        const allowed = ['"react-intl"'];
        const specifier = s.moduleSpecifier.getText(sourceFile);
  
        if (!allowed.includes(specifier) && !specifier.startsWith('".')) {
          errors.push(new Error(`The import ${specifier} is not allowlisted ([${allowed.join(", ")}]) nor relative`));
        }
      });
    } catch (error) {
      errors.push(new Error(`The TypeScript API usage crashed when looking into this file`));

    }

  } else {
    // This should just be a simple lint that it only has a declaration
    const tooManyStatements = sourceFile.statements.length > 1;
    const docExportStatement = sourceFile.statements[0]

    if (tooManyStatements) {
      errors.push(
        new Error("TS files had more than one statement (e.g. more than `export const somethingCopy = { ... }` ")
      );
    }

    if(!sourceFile.statements.length) {
      // Allow empty files
      return []
    }

    if(!docExportStatement || !ts.isVariableStatement(docExportStatement)) {
    
      errors.push(new Error("TS files should only look like: `export const somethingCopy = { ... }` "));
    } else {

      const lastStatement = docExportStatement.declarationList;
      if (!ts.isVariableDeclarationList(lastStatement)) {
        errors.push(new Error("TS files should only look like: `export const somethingCopy = { ... }` "));
      } else {
        const init = lastStatement.declarations[0].initializer;
        if (!init) {
          errors.push(new Error("Something is off in the const in that file"));
        } else if(ts.isObjectLiteralExpression(init)) {
          init.properties.forEach((prop) => {
            if (!ts.isPropertyAssignment(prop)) {
              errors.push(new Error(`You can only have property assignments in the export ( ${prop.getText(sourceFile)} )`));
            } else {

              const init = prop.initializer;
              if (!ts.isStringLiteral(init) && !ts.isNoSubstitutionTemplateLiteral(init)) {
                if (ts.isTemplateExpression(init)) {
                  errors.push(new Error(`The template string at ${prop.name.getText(sourceFile)} can't have evaluated code ( no \${} allowed )`));
                } else {
                  errors.push(new Error(`The value at ${prop.name.getText(sourceFile)} isn't a string`));
                }
              }
            }
          });
        }
      } 
    }
  }

  return errors.map((e) => ({ path: file, error: e }));
}
