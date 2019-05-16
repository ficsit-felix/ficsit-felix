# FICSIT - FeliX

![Screenshot of FeliX](app/public/screenshot.png)

FeliX is a webapp to inspect save files of the game Satisfactory. [You can try it out online.](https://ficsit-felix.firebaseapp.com/)

It uses JavaScript, Vue, three.js and some other libraries for the frontend and TypeScript for Firebase functions on the backend. It is currently in the prototype stage. Any contributions are greatly appreciated!

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

## Licensing
All script files are distributed unter the [MIT license](LICENSE).

All models in `app/public/models` are distributed under the [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) license. For attribution see the corresponding [AUTHORS file](app/public/models/AUTHORS).

## Other useful repositories
https://github.com/bitowl/satisfactory-save-format  
Scripts to convert save files to json and back written in Python

https://github.com/Vilsol/satisfactory-tool  
Save file to json converter written in Go

https://github.com/Goz3rr/SatisfactorySaveEditor  
Save file editor for Windows written in C#
