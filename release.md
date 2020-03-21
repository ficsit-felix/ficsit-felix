# Release Instructions

## While developing
Create a draft release on https://github.com/ficsit-felix/satisfactory-json/releases/new
Tag version: `v0.0.0`
Release title: `0.0.0`
Target: `master`
Save as draft
Add changes to draft message
Increase version in package.json to `0.0.0`

## Release
Switch to `master` branch
Merge `develop` branch
Execute `yarn lint --fix`
Commit with name `Release 0.0.0`
Push to master branch
Wait until the actions build the electron application
Publish the draft commit

## After release
Switch to `develop` branch
Merge `master` branch