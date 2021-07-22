# TypeScript Website Localizations

A repo for handling localized versions of the TypeScript website content

### Setting up

```sh
git clone https://github.com/microsoft/TypeScript-Website-Localizations
cd TypeScript-Website-Localizations

# Setup
yarn

# Optional: Grab the English files to make translation easier
yarn pull-en

# Optional: Verify your changes will correctly replace the english files
yarn lint
# Alternative: Run the lint watcher
yarn lint --watch
```

That's it, you've got a copy of all the documentation and now can write documentation which follows the existing patterns. There's a longer intro [in `welcome.md`](./welcome.md).

### How translations work 

The TypeScript website handles translations by having language specific files with matching filepaths:

E.g: [`/packages/documentation/copy/en/reference/JSX.md`](https://github.com/microsoft/TypeScript-website/blob/68a4f67ed5f396228eeb6d0309b51bcfb19d31a1/packages/documentation/copy/en/reference/JSX.md#L1)

Has existing translations in different languages:

```sh
/packages/documentation/copy/id/reference/JSX.md
/packages/documentation/copy/ja/reference/JSX.md
/packages/documentation/copy/pt/reference/JSX.md
```

Same path, just switched `en` for `id`, `ja` & `pt`.

#### This repo

This repo contains all of the non-English locale files. It means you can clone and translate without all the infrastructure overhead of the pretty complex TypeScript-Website. 

For example if you wanted to translate a new handbook page you would:

- Clone this repo (see above)
- Pull in the English files `yarn pull-en` (these will be gitignored)
- Find your english file: `docs/documentation/en/handbook-v2/Basics.md`
- Recreate the same folder path in your language: `docs/documentation/it/handbook-v2/Basics.md`
- Translate the file!
- Validate your changes: `yarn lint` (or `yarn lint docs/documentation/it/handbook-v2/Basics.md`)
- Create a pull request to this repo
- Once merged, the translation will appear on the next website deploy

#### Language owners

When a new language is created, we ask for a few people to become language owners. These owners are able to merge pull requests to files in their language via [code-owner-self-merge](https://github.com/OSS-Docs-Tools/code-owner-self-merge) in a pull request. They will be pinged on PRs which affect them, you can see the flow in PRs like [this](https://github.com/microsoft/TypeScript-Website/pull/1478) or [this](https://github.com/microsoft/TypeScript-Website/pull/1458).

The TypeScript team generally only know English, and can answer clarifying questions if needed! For quick questions, you can use the `ts-website-translation` channel in the [TypeScript Discord](https://discord.gg/typescript).

#### Secure

This repo has extensive CI to ensure that you can't accidentally break the TypeScript website. 

There are local, fast checks that it won't break via `yarn test` and then the full TypeScript website test suite runs with the changes, and a website build is generated to ensure that nothing breaks.

The checks may not seem obvious to an outsider, because the website is complex, so there is a watch mode which you can run via `yarn link --watch` to get instant feedback.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all other rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
