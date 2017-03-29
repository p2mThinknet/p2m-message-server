#!/usr/bin/env bash

cd /
yarn install
yarn build
rm -rf src
rm -rf node_modules

yarn install --prod
