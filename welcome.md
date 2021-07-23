### Hello Translator

Hey there someone looking at contributing to the TypeScript docs localization effort. This repo contains all of the non-English locale files. It means you can clone and translate without all the infrastructure overhead of the pretty complex TypeScript-Website. 

For each language there is a [Translation Summary issue](https://github.com/microsoft/TypeScript-Website-Localizations/issues?q=is%3Aissue+is%3Aopen+label%3A%22Translation+Summary%22) which is sort of the TODO per language. 

The website handles localization in a few different ways, but you can think of it as "if I can do it in lang x, otherwise english" for as much as possible. 

This means you can do _some_ localization and the site will work fine and only be partially translated.

## Our Thanks

Localization is important work, and having technical contributors who understand TypeScript helping out is a massive win for everyone. You're helping people to _not need_ to master English to program and that lowers barriers considerably.

`<3`

## The sections

### `Documentation`

This is the handbook pages, reference material and all the other pages you think of as "TypeScript Documentation". You create a file with the same name as the English, and it replaces the english with your language.


### `Playground` 

The code samples in the Playground are localized, and are a good starting place for a new language because they are pretty short and focused.

### `TSConfig Reference` 

A chunky section covering all of the TSConfig file options. These are split into many markdown files, so you can quite easily do one or two at a time.

### `TypeScript Lang` 

The 'bits of text' on the website, the glue between all of the website. Not _everything_ is in here. If something essential is missing bring it up in the localization channel in Discord.

## Getting started

Instructions in [the README](https://github.com/microsoft/TypeScript-Website-Localizations) show to get set up, and to run a validator that your changes are good!