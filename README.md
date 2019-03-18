# FICSIT - FeliX


You can find python scripts to transform save files to json and back at https://github.com/bitowl/satisfactory-save-format.

## Development
### Start functions backend
```
cd functions
sudo yarn serve
```
### Start Vue frontend
```
cd app
yarn serve
```


## Deploy to Firebase
```
cd functions
yarn build
cd ../app
yarn build
cd ..
firebase deploy
```