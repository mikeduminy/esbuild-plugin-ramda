const fs = require('fs');
const path = require('path');

const destructuredImportRegex = RegExp(/\{\s?(((\w+),?\s?)+)\}/, 'g');
const namespacedImportRegex = RegExp(/(?:\*\sas\s?(.*)\sfrom\s?['"])/, 'g');

function pluginRamdaImport(options = {}) {
  const { filter = /.*/ } = options;

  return {
    name: 'ramda',
    setup(build) {
      build.onLoad({ filter }, async (args) => {
        const contents = await fs.promises.readFile(args.path, 'utf8');
        const extension = path.extname(args.path).replace('.', '');
        const loader = extension === 'js' ? 'jsx' : extension;

        const ramdaImportRegex =
          /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)[\'\"](?:(?:ramda\/?.*?))[\'\"][\s]*?(?:;|$|)/g;

        const ramdaImports = contents.match(ramdaImportRegex);
        if (!ramdaImports) {
          return {
            loader,
            contents,
          };
        }

        const importNames = new Set();
        let finalContents = contents;

        ramdaImports.forEach((line) => {
          // Capture content inside curly braces within imports, eg:
          // import { noop } from 'ramda'
          // = "noop"
          const destructuredImports = line.match(destructuredImportRegex);
          if (destructuredImports) {
            // import { noop, isEmpty, debounce as _debounce } from 'ramda'
            // = ["noop", "isEmpty", "debounce as _debounce"]
            destructuredImports[0]
              .replace(/[{}]/g, '')
              .trim()
              .split(', ')
              .map((str) => importNames.add(str));
          }

          // Capture the namespaced import if present, eg:
          // import * as R from 'ramda'
          // = "R"
          const namespacedImportMatch = namespacedImportRegex.exec(line);
          if (namespacedImportMatch) {
            const [, namespacedImportVariable] = namespacedImportMatch;

            if (!namespacedImportVariable) {
              throw new Error(
                'Something went wrong when extracting the namespaced import variable name',
                line
              );
            }

            if (namespacedImportVariable) {
              // construct a regexp to detect function calls of fields in namespace, eg:
              // R.add(1, 2)
              // = "add"
              const namespaceVariableRegex = new RegExp(
                `\\b${namespacedImportVariable}\\.(.*)\\(`,
                'g'
              );

              // string.replaceAll is not available until node 15 :(
              for (let [, field] of contents.matchAll(namespaceVariableRegex)) {
                console.log('extracting field ', field);

                // extract field name, eg:
                // R.add()
                // = "add"
                importNames.add(field);
              }

              // replace usage, eg:
              // R.add()
              // = add()
              finalContents = finalContents.replace(
                namespaceVariableRegex,
                '$1('
              );
            }
          }

          if (importNames.size > 0) {
            let result = '';

            importNames.forEach((name) => {
              const previousResult = `${result ? `${result}\n` : ''}`;
              if (name.includes(' as ')) {
                const [realName, alias] = name.split(' as ');
                result = `${previousResult}import ${alias} from 'ramda/src/${realName}';`;
              } else {
                result = `${previousResult}import ${name} from 'ramda/src/${name}';`;
              }
            });

            finalContents = finalContents.replace(line, result);
          }
        });

        return {
          loader,
          contents: finalContents,
        };
      });
    },
  };
}

module.exports = pluginRamdaImport;
