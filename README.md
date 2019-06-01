# TurboAery
[![Build Status](https://dev.azure.com/dixaba/Dixaba/_apis/build/status/Dixaba.TurboAery?branchName=master)](https://dev.azure.com/dixaba/Dixaba/_build/latest?definitionId=14&branchName=master)

Assistant tool for League players

## Riot API key installation

In a `/public` folder create a file named `apikey.js` with the following content:
```
const apikey = 'place_key_here';

module.exports = apikey;
```
Don't forget to replace the placeholder string with your actual API key.

Do not commit this file.

## How to run in developer mode

`npm run electron-dev`

## How to build

`npm run build-app` will place a built app in a `/dist` directory

If you want to pack an app in installer run `npm run pack-app`
