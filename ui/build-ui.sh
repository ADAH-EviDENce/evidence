#!/usr/bin/env bash
set -e

npm run build
rm -rf ../static
mkdir ../static
cp -r ./build/* ../static