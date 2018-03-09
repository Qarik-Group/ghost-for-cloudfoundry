#!/bin/bash

set -eux

git clone app app-with-upgrade

mkdir ghost-src
pushd ghost-src
unzip ../ghost/Ghost-*.zip
popd

export GHOST_SRC=$PWD/ghost-src
export GHOST_VERSION=$(cat ghost/version)

cd app-with-upgrade

./bin/upgrade_ghost.sh

if [[ -z "$(git config --global user.name)" ]]
then
  git config --global user.name "Concourse Bot"
  git config --global user.email "drnic+bot@starkandwayne.com"
fi
