#!/bin/bash

set -e -x

ghost_tag=$(cat ghost/tag)
tar xfz ghost/source.tar.gz
# creates TryGhost-Ghost-XXXX folder

git clone ghost-for-cf ghost-updated

ls -al ghost-updated/
rm -rf ghost-updated/core ghost-updated/node_modules ghost-updated/index.js \
  ghost-updated/package.json ghost-updated/npm-shrinkwrap.json \
  ghost-updated/content/themes/casper

cp -r TryGhost-Ghost-*/core ghost-updated/
cp -r TryGhost-Ghost-*/index.js ghost-updated/
cp -r TryGhost-Ghost-*/package.json ghost-updated/
cp -r TryGhost-Ghost-*/content/themes/casper ghost-updated/content/themes/

cd ghost-updated

cat package.json | jq -r "del(.dependencies.sqlite3)" > package-edited.json && mv package-edited.json package.json
cat package.json | jq -r "del(.devDependencies.sqlite3)" > package-edited.json && mv package-edited.json package.json
cat package.json | jq ".dependencies[\"pg\"] = \"4.1.1\"" > package-edited.json && mv package-edited.json package.json
cat package.json | jq ".dependencies[\"cfenv\"] = \"~1.0.3\"" > package-edited.json && mv package-edited.json package.json
cat package.json | jq ".dependencies[\"ghost-s3-storage\"] = \"0.2.2\"" > package-edited.json && mv package-edited.json package.json

cat package.json

npm install --production --save
npm shrinkwrap

if [[ -z "$(git config --global user.name)" ]]
then
  git config --global user.name "Concourse Bot"
  git config --global user.email "drnic+bot@starkandwayne.com"
fi

git add .
git commit -a -m "updated to ghost ${ghost_tag}"
