const express = require('express'),
    path = require('path'),
    config = require('../../config'),
    constants = require('../../lib/constants'),
    themeUtils = require('../../services/themes');

function isBlackListedFileType(file) {
    const blackListedFileTypes = ['.hbs', '.md', '.json'],
        ext = path.extname(file);
    return blackListedFileTypes.includes(ext);
}

function isWhiteListedFile(file) {
    const whiteListedFiles = ['manifest.json'],
        base = path.basename(file);
    return whiteListedFiles.includes(base);
}

function forwardToExpressStatic(req, res, next) {
    if (!themeUtils.getActive()) {
        return next();
    }

    const configMaxAge = config.get('caching:theme:maxAge');

    express.static(themeUtils.getActive().path,
        {maxAge: (configMaxAge || configMaxAge === 0) ? configMaxAge : constants.ONE_YEAR_MS}
    )(req, res, next);
}

function staticTheme() {
    return function blackListStatic(req, res, next) {
        if (!isWhiteListedFile(req.path) && isBlackListedFileType(req.path)) {
            return next();
        }
        return forwardToExpressStatic(req, res, next);
    };
}

module.exports = staticTheme;
