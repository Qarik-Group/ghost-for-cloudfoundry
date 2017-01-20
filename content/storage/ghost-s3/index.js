'use strict';

// # S3 storage module for Ghost blog http://ghost.org/
// https://github.com/aorcsik/ghost-s3-storage-adapter/blob/master/index.js
// v3.0.4

var requireFromGhost = function(module, blocking) {
    try {
        return require('ghost/' + module);
    } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') throw e;
        try {
            return require(path.join(process.cwd(), module));
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND' || blocking) throw e;
            return null;
        }
    }
};

var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    AWS = require('aws-sdk'),
    Promise = require('bluebird'),
    readFileAsync = Promise.promisify(fs.readFile),
    BaseStore = requireFromGhost("core/server/storage/base", false),
    LocalFileStore = requireFromGhost("core/server/storage/local-file-store", false);

// Use Bluebird Promises in AWS
AWS.config.setPromisesDependency(Promise);


function S3Store(config) {
    if (BaseStore) BaseStore.call(this);
    this.config = config;
    this.s3Client = null;
}

if (BaseStore) util.inherits(S3Store, BaseStore);

S3Store.prototype.getObjectURL = function(filename) {
    var assetHost = this.config.assetHost;
    if (!assetHost) {
        var reagionSubdomain = (this.config.region == 'us-east-1') ? 's3' : 's3-' + this.config.region;
        assetHost = 'https://' + reagionSubdomain + '.amazonaws.com/' + this.config.bucket + '/';
    }
    return assetHost + filename;
};

S3Store.prototype.initS3Client = function() {
    if (!!this.config.accessKeyId &&
        !!this.config.secretAccessKey &&
        !!this.config.bucket &&
        !!this.config.region) {
        if (!this.s3Client) {
            this.s3Client = new AWS.S3({
                accessKeyId: this.config.accessKeyId,
                secretAccessKey: this.config.secretAccessKey,
                region: this.config.region
            });
        }
        return this.s3Client;
    }
    throw Error('ghost-s3 is not configured');
};

// Implement BaseStore::save(image, targetDir)
S3Store.prototype.save = function(image, targetDir) {
    var self = this;

    targetDir = targetDir || this.getTargetDir();

    try {
        this.initS3Client();
    } catch (error) {
        return Promise.reject(error.message);
    }

    var filename;
    return this.getUniqueFileName(this, image, targetDir)
        .then(function(result) {
            filename = result;
            return readFileAsync(image.path);
        })
        .then(function (buffer) {
            var params = {
                ACL: 'public-read',
                Bucket: self.config.bucket,
                Key: filename,
                Body: buffer,
                ContentType: image.type,
                CacheControl: 'max-age=' + (1000 * 365 * 24 * 60 * 60) // 365 days
            };
            return self.s3Client.putObject(params).promise();
        })
        .tap(function() {
            console.log('ghost-s3', 'Temp uploaded file path: ' + image.path);
        })
        .then(function(results) {
            return Promise.resolve(self.getObjectURL(filename));
        })
        .catch(function(err) {
            console.error('ghost-s3', err);
            throw err;
        });
};

// Implement BaseStore::save(filename)
S3Store.prototype.exists = function(filename) {
    var params = {
        Bucket: this.config.bucket,
        Key: filename
    };

    try {
        this.initS3Client();
    } catch (error) {
        return Promise.reject(error.message);
    }

    return this.s3Client.headObject(params).promise()
        .then(function(results) {
            return Promise.resolve(true);
        })
        .catch(function(err) {
            return Promise.resolve(false);
        });
};

// Implement BaseStore::serve(options)
// middleware for serving the files
S3Store.prototype.serve = function(options) {
    options = options || {};

    // Preserve Theme download functionality
    if (options.isTheme) {
        if (LocalFileStore) {
            return (new LocalFileStore()).serve(options);
        }
        return function(req, res, next) {
            res.status(404);
        };
    }

    var s3Client;
    try {
        s3Client = this.initS3Client();
    } catch (err) {
        return function(req, res, next) {
            console.error("ghost-s3", err);
            res.status(500);
        };
    }

    return function (req, res, next) {
        var params = {
            Bucket: this.config.bucket,
            Key: req.path.replace(/^\//, '')
        };

        s3Client.getObject(params)
            .on('httpHeaders', function(statusCode, headers, response) {
                res.set(headers);
            })
            .createReadStream()
            .on('error', function(err) {
                console.error("ghost-s3", err);
                res.status(404);
                next();
            })
            .pipe(res);
    };
};

// Implement BaseStore::delete(filename, targetDir)
S3Store.prototype.delete = function(filename, targetDir) {
    targetDir = targetDir || this.getTargetDir();

    var pathToDelete = path.join(targetDir, filename);

    try {
        this.initS3Client();
    } catch (error) {
        return Promise.reject(error.message);
    }

    var params = {
        Bucket: this.config.bucket,
        Key: pathToDelete
    };

    return this.s3Client.deleteObject(params).promise()
        .tap(function() {
            console.log('ghost-s3', 'Deleted file: ' + pathToDelete);
        })
        .then(function(results) {
            return Promise.resolve(true);
        })
        .catch(function(err) {
            return Promise.resolve(false);
        });
};

module.exports = S3Store;
