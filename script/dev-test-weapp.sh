#!/bin/bash

# node version 17
# NODE_OPTIONS=--openssl-legacy-provider npm run dev:weapp

# node version below 17
rm -rf ./dist
npm run dev-test:weapp
