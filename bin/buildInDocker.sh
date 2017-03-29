#!/usr/bin/env bash

cd /
# ensure install devDependencies.
NODE_ENV= yarn install
yarn build
rm -rf src
rm -rf node_modules

yarn install --prod
