#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm set registry https://registry.npmjs.org/

npm install -g verdaccio
npm install -g concurrently
npm install -g verdaccio-auth-memory

$DIR/update-version.sh -nextalpha

npm set registry http://localhost:4873/

concurrently "verdaccio --listen 4873 --config $DIR/../assets/config-verdaccio.yaml" "$DIR/npm-publish.sh"
