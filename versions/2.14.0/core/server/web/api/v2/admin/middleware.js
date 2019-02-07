const common = require('../../../../lib/common');
const auth = require('../../../../services/auth');
const shared = require('../../../shared');

const notImplemented = function (req, res, next) {
    // CASE: user is logged in, allow
    if (!req.api_key) {
        return next();
    }

    // @NOTE: integrations have limited access for now
    const whitelisted = {
        // @NOTE: stable
        posts: ['GET', 'PUT', 'DELETE', 'POST'],
        tags: ['GET', 'PUT', 'DELETE', 'POST'],
        images: ['POST'],
        // @NOTE: experimental
        users: ['GET'],
        themes: ['POST'],
        subscribers: ['GET', 'PUT', 'DELETE', 'POST'],
        configuration: ['GET'],
        actions: ['GET']
    };

    const match = req.url.match(/^\/(\w+)\/?/);

    if (match) {
        const entity = match[1];

        if (whitelisted[entity] && whitelisted[entity].includes(req.method)) {
            return next();
        }
    }

    next(new common.errors.GhostError({
        errorType: 'NotImplementedError',
        message: common.i18n.t('errors.api.common.notImplemented'),
        statusCode: '501'
    }));
};

/**
 * Authentication for private endpoints
 */
module.exports.authAdminApi = [
    auth.authenticate.authenticateAdminApi,
    auth.authorize.authorizeAdminApi,
    shared.middlewares.updateUserLastSeen,
    shared.middlewares.api.cors,
    shared.middlewares.urlRedirects.adminRedirect,
    shared.middlewares.prettyUrls,
    notImplemented
];

/**
 * Authentication for client endpoints
 */
module.exports.authenticateClient = function authenticateClient(client) {
    return [
        auth.authenticate.authenticateClient,
        auth.authenticate.authenticateUser,
        auth.authorize.requiresAuthorizedClient(client),
        shared.middlewares.api.cors,
        shared.middlewares.urlRedirects.adminRedirect,
        shared.middlewares.prettyUrls
    ];
};
