#!/bin/bash

set -e -x

DEVELOP=$PWD/develop

git clone ./master ./merged

cd merged

git remote add local $DEVELOP

git fetch local
git checkout local/develop

if [[ -z "$(git config --global user.name)" ]]
then
  git config --global user.name "Concourse Bot"
  git config --global user.email "drnic+bot@starkandwayne.com"
fi

git merge --no-edit master
