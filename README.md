# Ghost blog for Cloud Foundry

This repo is a fork of the lovely open source blogging engine [Ghost](https://github.com/TryGhost/Ghost) to make it easy to run on any Cloud Foundry.

For example, we run Ghost at https://www.starkandwayne.com/blog using this repository.

The modifications in this repository - versus the upstream https://github.com/TryGhost/Ghost - are:

* `bin/setup_and_run.sh` that loads MySQL from the `$VCAP_SERVICES` provided by Cloud Foundry (see below for setup) - used for storing blog posts
* `bin/setup_and_run.sh` that loads AWS S3 credentials from `$VCAP_SERVICES` - used for storing uploaded images from authors
* `bin/setup_and_run.sh` that looks for email credentials from `$VCAP_SERVICES` - used for sending invitation emails, password resets etc.
* custom themes for https://www.starkandwayne.com/blog and https://www.dingotiles.com/blog, in addition to the default upstream Casper theme

This repository also includes the Concourse pipeline `ci/pipeline.yml` for automatically attempting to upgrade to any new version of Ghost (https://github.com/TryGhost/Ghost/releases). We are running this pipeline at https://ci2.starkandwayne.com/teams/starkandwayne/pipelines/blog-starkandwayne

## Deploy to Cloud Foundry

First, target your Cloud Foundry and create a space for deploying the application and its dependent service instances:

```plain
cf login -a https://api.run.pivotal.io
cf create-space blog-production
cf target -s blog-production
```

Next, provision three service instances:

* MySQL
* Email
* AWS S3

For Pivotal Web Services, as an example, you might choose ClearDB for MySQL, SendGrid for email, and a custom user-provided service instance for your AWS S3 account.

```plain
cf create-service cleardb spark ghost-mysql
cf create-service sendgrid free ghost-email
cf create-user-provided-service ghost-s3 -p '{"access_key_id":"AKIAI74XXXX","secret_access_key":"rXuScFqhvqXXXXX","bucket":"BUCKETNAME","region":"us-east-1"}'
```

As the services are already bound via manifest, there's no need to bind them via command anymore.

Next, deploy/push the Ghost application without starting it, and then restart:

```plain
cf push --no-start --random-route
cf restart ghost
```

In another terminal window you can observe the Ghost logs using:

```plain
cf logs ghost
```

The last line of the logs will include the URL:

```plain
2017-01-23T11:41:40.84+1000 [APP/PROC/WEB/0]OUT Ghost is running in production...
2017-01-23T11:41:40.84+1000 [APP/PROC/WEB/0]OUT Your blog is now available on http://ghost-villalike-mee.cfapps.io
```

From Cloud Foundry's perspective, the Ghost blog is a Node.js web application. It will automatically select a secure version of Node.js and package manager, then download all the Node.js dependencies (see `package.json`). Using Cloud Foundry it is as lovely to run web applications as it is to write blog posts on Ghost.

The `--random-route` flag above is optional. You can bind any route to your Cloud Foundry application.

For example, we have Ghost running on Pivotal Web Services, and we bound https://www.starkandwayne.com/blog to this application. The command we used to do this was:

```plain
cf map-route ghost starkandwayne.com --hostname www --path blog
```

Go to the `/ghost` end point to setup your blog, create your initial author/admin user, and invite other people to become authors on your blog.

## MySQL notes

Historically I (@drnic) discovered that Ghost's DB migrations might set a lock during startup and cause startup to fail. My workaround during `bin/setup_and_run.sh` is to run the following before starting the Node.js process:

```shell
mysqlsh --uri $mysqluri --sql -e "UPDATE migrations_lock set locked=0 where lock_key='km01';"
```

The `mysqlsh` application comes from the `mysql-shell` package.

This package for Ubuntu Xenial 16.04 (used by `cflinuxfs3` stack) was downloaded and cached within http://apt.starkandwayne.com; from which it is installed via the `apt-buildpack` (see `apt.yml`).

```plain
$ deb-s3 list --bucket apt.starkandwayne.com
...
mysql-shell            8.0.15-1ubuntu16.04  amd64
```

For future reference, I uploaded the .deb file using `deb-s3` CLI:

```plain
deb-s3 upload ~/Downloads/mysql-shell_8.0.15-1ubuntu18.04_amd64.deb --bucket apt.starkandwayne.com --sign <id>
```

## Local development

Whilst the `.profile` is used during `cf push` to setup the local file system/symlinks/config files, and to migrate the database, when we test the application locally we can use `bin/setup_and_run.sh`:

```plain
PORT=8000 SKIP_SETUP=1 NODE_ENV=development ./bin/setup_and_run.sh
```

This will run Ghost locally, but configure it to interact with the MySQL database from your Cloud Foundry.

* `PORT=8000` will set the local port
* `SKIP_SETUP=1` stops the script from performing database migrations
* `NODE_ENV=development` overrides this env var, and changes the `config.development.json` file name used.

Once it is running, it will show the local URL http://localhost:8000/:

```plain
[2020-02-18 21:45:44] INFO Ghost is running in development...
[2020-02-18 21:45:44] INFO Listening on: 0.0.0.0:8000
[2020-02-18 21:45:44] INFO Url configured as: http://localhost:8000/
[2020-02-18 21:45:44] INFO Ctrl+C to shut down
[2020-02-18 21:45:44] INFO Ghost boot 13.683s
```

You can also use `grunt dev` to observe live changes in the templates:

```bash
cd current
grunt dev
```

## Buildkite Pipeline

We use Buildkite to deploy this Ghost/NodeJS application to Cloud Foundry, including separate deployments for our own branches, and your pull requests.

Status of builds for your pull requests will be posted into the pull request, and can be found at https://buildkite.com/starkandwayne/starkandwayne-dot-com-blog/.

### Deploy yourself using Buildkite Pipeline

[![Add to Buildkite](https://buildkite.com/button.svg)](https://buildkite.com/new)

Use Branch Filtering to restrict the Pipeline to only deploy commits to your primary branch (e.g. `production`).

Add a webhook, and only trigger on Git commits.
