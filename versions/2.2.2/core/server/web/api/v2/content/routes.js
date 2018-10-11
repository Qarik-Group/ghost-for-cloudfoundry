const express = require('express');
const api = require('../../../../api');
const apiv2 = require('../../../../api/v2');
const shared = require('../../../shared');
const mw = require('./middleware');

module.exports = function apiRoutes() {
    const router = express.Router();

    // alias delete with del
    router.del = router.delete;

    // ## CORS pre-flight check
    router.options('*', shared.middlewares.api.cors);

    // ## Configuration
    router.get('/configuration', api.http(api.configuration.read));

    // ## Posts
    router.get('/posts', mw.authenticatePublic, api.http(api.posts.browse));
    router.get('/posts/:id', mw.authenticatePublic, api.http(api.posts.read));
    router.get('/posts/slug/:slug', mw.authenticatePublic, api.http(api.posts.read));

    // ## Pages
    router.get('/pages', mw.authenticatePublic, apiv2.http(apiv2.pages.browse));

    // ## Users
    router.get('/users', mw.authenticatePublic, api.http(api.users.browse));
    router.get('/users/:id', mw.authenticatePublic, api.http(api.users.read));
    router.get('/users/slug/:slug', mw.authenticatePublic, api.http(api.users.read));

    // ## Tags
    router.get('/tags', mw.authenticatePublic, api.http(api.tags.browse));
    router.get('/tags/:id', mw.authenticatePublic, api.http(api.tags.read));
    router.get('/tags/slug/:slug', mw.authenticatePublic, api.http(api.tags.read));

    // ## Subscribers
    // @TODO: find a way than `middlewares.labs`
    router.post('/subscribers', shared.middlewares.labs.subscribers, mw.authenticatePublic, api.http(api.subscribers.add));

    // ## Clients
    router.get('/clients/slug/:slug', api.http(api.clients.read));

    return router;
};
