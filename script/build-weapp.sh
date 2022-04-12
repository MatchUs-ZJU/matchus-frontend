#!/bin/bash

# node version 17
# NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production taro build --type weapp --watch

# node version below 17
NODE_ENV=production taro build --type weapp --watch
