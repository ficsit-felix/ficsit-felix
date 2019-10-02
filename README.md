# FICSIT - FeliX

![Screenshot of FeliX](app/public/screenshot.png)

FeliX is an application to inspect save files of the game Satisfactory. [You can try it out online](https://ficsit-felix.web.app/) or [download the latest release for desktop here.](https://github.com/ficsit-felix/ficsit-felix/releases/latest)

It uses JavaScript, TypeScript, Vue, three.js and some other libraries. It is currently in the prototype stage. Any contributions are greatly appreciated!

## Development

Install the dependencies:

```
cd app
yarn global add @vue/cli
yarn install
```

To run the application with hot reloading simply execute:

```
cd app
yarn serve
```

To use a local copy of `satisfactory-json` for development use [yarn link](https://yarnpkg.com/lang/en/docs/cli/link/). To hot-reload the library code use `yarn build:watch` in the `satisfactory-json` repository.

## Licensing

All script files are distributed unter the [MIT license](LICENSE).

All models in `app/public/models` are distributed under the [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) license. For attribution see the corresponding [AUTHORS file](app/public/models/AUTHORS).

## Other useful repositories

https://github.com/ficsit-felix/satisfactory-json  
Library to convert from Satisfactory save files to a JSON format and back

https://github.com/Vilsol/satisfactory-tool  
Save file to json converter written in Go

https://github.com/Goz3rr/SatisfactorySaveEditor  
Save file editor for Windows written in C#
