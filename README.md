# Ghost blog for Cloud Foundry

This repo is a fork of the lovely open source blogging engine [Ghost](https://github.com/TryGhost/Ghost) to make it easy to run on any Cloud Foundry.

For example, we run Ghost at https://www.starkandwayne.com/blog, https://www.starkandwayne.com/videos and https://www.dingotiles.com/blog using this repository.

The modifications in this repository - versus the upstream https://github.com/TryGhost/Ghost - are:

* `config.js` that loads PostgreSQL from the `$VCAP_SERVICES` provided by Cloud Foundry (see below for setup) - used for storing blog posts
* `config.js` that loads AWS S3 credentials from `$VCAP_SERVICES` - used for storing uploaded images from authors
* custom themes for https://www.starkandwayne.com/blog and https://www.dingotiles.com/blog, in addition to the default upstream Casper theme

This repository also includes the Concourse pipeline `ci/pipeline.yml` for automatically attempting to upgrade to any new version of Ghost (https://github.com/TryGhost/Ghost/releases).
