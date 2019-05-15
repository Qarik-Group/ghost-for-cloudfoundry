#!/bin/bash

set -eu

: ${GHOST_SRC:?required directory for new Ghost version}
: ${GHOST_VERSION:?required}

if [[ ! -f ${GHOST_SRC}/MigratorConfig.js ]]; then
  echo "Target \$GHOST_SRC directory does not appear to be a Ghost directory"
  exit 1
fi

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT"

rm -rf versions
mkdir -p versions
rm -f current
rm -rf content/themes/casper

cp -r ${GHOST_SRC} versions/${GHOST_VERSION}

ln -s versions/* current
pushd content/themes/
  ln -s ../../current/content/themes/casper/
popd

pushd current
  yarn add ghost-storage-adapter-s3
  yarn add aws-sdk@2.6.3
popd

cp current/package.json .

mkdir -p current/core/server/public
sed -i -E 's%"postinstall":(.*)cpy(.*.js\s+)(core/server/public/)%"postinstall":\1cp\2/home/vcap/app/current/\3%' package.json

cp current/yarn.lock .
rm -rf node_modules
cp -r current/node_modules .

mkdir -p content/adapters/storage
rm -rf content/adapters/storage/*s3*
cp -r current/node_modules/ghost-storage-adapter-s3 content/adapters/storage/s3

