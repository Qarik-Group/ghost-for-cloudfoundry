#!/bin/bash

set -e -x

# http://support.ghost.org/how-to-upgrade/

git clone develop develop_upgraded

develop_upgraded=$PWD/develop_upgraded
source_zip=$(ls $PWD/ghost/Ghost*.zip)
ghost_version=$(cat ghost/version)

mkdir -p unpack
unpack_dir=$PWD/unpack

cd $unpack_dir/
unzip $source_zip

cd $develop_upgraded/

rm -rf core npm-shrinkwrap.json

cp $unpack_dir/index.js .
cp $unpack_dir/Gruntfile.js .
cp $unpack_dir/config.example.js . #- config.js is not used anymore since 1.0,0 https://github.com/TryGhost/Ghost/issues/6982 https://dev.ghost.org/nconf/
cp $unpack_dir/MigratorConfig.js .
cp $unpack_dir/package.json .
# cp $unpack_dir/npm-shrinkwrap.json . - skipped since we add npm packages below
cp $unpack_dir/PRIVACY.md GHOST_PRIVACY.md
cp $unpack_dir/README.md GHOST_README.md
cp -r $unpack_dir/core .
cp -r $unpack_dir/content/* content/

# add npm packages for cf deployment
# - https://www.npmjs.com/package/cfenv
# - https://www.npmjs.com/package/ghost-s3-storage-adapter
cat package.json | \
  jq ".dependencies.cfenv = \"~1.0.3\"" | \
  jq ".dependencies[\"aws-sdk\"] = \"^2.3.0\"" \
  > cf-package.json
mv cf-package.json package.json

npm install --production
npm shrinkwrap

if [[ -z "$(git config --global user.name)" ]]
then
  git config --global user.name "Concourse Bot"
  git config --global user.email "drnic+bot@starkandwayne.com"
fi

git add .
git commit -a -m "update Ghost v${ghost_version}"
