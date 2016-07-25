#!/bin/bash

git clone ghost-for-cf ghost-updated

rm -rf ghost-updated/core ghost-updated/index.js ghost-updated/package.json ghost-updated/shrinkwrap.json


ls -al ghost/
pushd ghost
tar xfz source.tar.gz
ls -al .
