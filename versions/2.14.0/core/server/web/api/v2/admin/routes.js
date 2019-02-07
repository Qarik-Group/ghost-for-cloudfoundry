const express = require('express');
const api = require('../../../../api');
const apiv2 = require('../../../../api/v2');
const mw = require('./middleware');

const auth = require('../../../../services/auth');
const shared = require('../../../shared');

// Handling uploads & imports
const upload = shared.middlewares.upload;

module.exports = function apiRoutes() {
    const router = express.Router();

    // alias delete with del
    router.del = router.delete;

    // ## CORS pre-flight check
    router.options('*', shared.middlewares.api.cors);

    // ## Configuration
    router.get('/configuration', apiv2.http(apiv2.configuration.read));
    router.get('/configuration/:key', mw.authAdminApi, apiv2.http(apiv2.configuration.read));

    // ## Posts
    router.get('/posts', mw.authAdminApi, apiv2.http(apiv2.posts.browse));
    router.post('/posts', mw.authAdminApi, apiv2.http(apiv2.posts.add));
    router.get('/posts/:id', mw.authAdminApi, apiv2.http(apiv2.posts.read));
    router.get('/posts/slug/:slug', mw.authAdminApi, apiv2.http(apiv2.posts.read));
    router.put('/posts/:id', mw.authAdminApi, apiv2.http(apiv2.posts.edit));
    router.del('/posts/:id', mw.authAdminApi, apiv2.http(apiv2.posts.destroy));

    // # Integrations

    router.get('/integrations', mw.authAdminApi, apiv2.http(apiv2.integrations.browse));
    router.get('/integrations/:id', mw.authAdminApi, apiv2.http(apiv2.integrations.read));
    router.post('/integrations', mw.authAdminApi, apiv2.http(apiv2.integrations.add));
    router.put('/integrations/:id', mw.authAdminApi, apiv2.http(apiv2.integrations.edit));
    router.del('/integrations/:id', mw.authAdminApi, apiv2.http(apiv2.integrations.destroy));

    // ## Schedules
    router.put('/schedules/posts/:id', [
        auth.authenticate.authenticateClient,
        auth.authenticate.authenticateUser
    ], api.http(api.schedules.publishPost));

    // ## Settings
    router.get('/settings/routes/yaml', mw.authAdminApi, apiv2.http(apiv2.settings.download));
    router.post('/settings/routes/yaml',
        mw.authAdminApi,
        upload.single('routes'),
        shared.middlewares.validation.upload({type: 'routes'}),
        apiv2.http(apiv2.settings.upload)
    );

    router.get('/settings', mw.authAdminApi, apiv2.http(apiv2.settings.browse));
    router.get('/settings/:key', mw.authAdminApi, apiv2.http(apiv2.settings.read));
    router.put('/settings', mw.authAdminApi, apiv2.http(apiv2.settings.edit));

    // ## Users
    router.get('/users', mw.authAdminApi, apiv2.http(apiv2.users.browse));
    router.get('/users/:id', mw.authAdminApi, apiv2.http(apiv2.users.read));
    router.get('/users/slug/:slug', mw.authAdminApi, apiv2.http(apiv2.users.read));
    // NOTE: We don't expose any email addresses via the public api.
    router.get('/users/email/:email', mw.authAdminApi, apiv2.http(apiv2.users.read));

    router.put('/users/password', mw.authAdminApi, apiv2.http(apiv2.users.changePassword));
    router.put('/users/owner', mw.authAdminApi, apiv2.http(apiv2.users.transferOwnership));
    router.put('/users/:id', mw.authAdminApi, apiv2.http(apiv2.users.edit));
    router.del('/users/:id', mw.authAdminApi, apiv2.http(apiv2.users.destroy));

    // ## Tags
    router.get('/tags', mw.authAdminApi, apiv2.http(apiv2.tags.browse));
    router.get('/tags/:id', mw.authAdminApi, apiv2.http(apiv2.tags.read));
    router.get('/tags/slug/:slug', mw.authAdminApi, apiv2.http(apiv2.tags.read));
    router.post('/tags', mw.authAdminApi, apiv2.http(apiv2.tags.add));
    router.put('/tags/:id', mw.authAdminApi, apiv2.http(apiv2.tags.edit));
    router.del('/tags/:id', mw.authAdminApi, apiv2.http(apiv2.tags.destroy));

    // ## Subscribers
    router.get('/subscribers', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.browse));
    router.get('/subscribers/csv', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.exportCSV));
    router.post('/subscribers/csv',
        shared.middlewares.labs.subscribers,
        mw.authAdminApi,
        upload.single('subscribersfile'),
        shared.middlewares.validation.upload({type: 'subscribers'}),
        apiv2.http(apiv2.subscribers.importCSV)
    );
    router.get('/subscribers/:id', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.read));
    router.get('/subscribers/email/:email', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.read));
    router.post('/subscribers', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.add));
    router.put('/subscribers/:id', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.edit));
    router.del('/subscribers/:id', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.destroy));
    router.del('/subscribers/email/:email', shared.middlewares.labs.subscribers, mw.authAdminApi, apiv2.http(apiv2.subscribers.destroy));

    // ## Members
    router.get('/members', shared.middlewares.labs.members, mw.authAdminApi, apiv2.http(apiv2.members.browse));
    router.get('/members/:id', shared.middlewares.labs.members, mw.authAdminApi, apiv2.http(apiv2.members.read));

    // ## Roles
    router.get('/roles/', mw.authAdminApi, apiv2.http(apiv2.roles.browse));

    // ## Clients
    router.get('/clients/slug/:slug', api.http(api.clients.read));

    // ## Slugs
    router.get('/slugs/:type/:name', mw.authAdminApi, apiv2.http(apiv2.slugs.generate));

    // ## Themes
    router.get('/themes/', mw.authAdminApi, apiv2.http(apiv2.themes.browse));

    router.get('/themes/:name/download',
        mw.authAdminApi,
        apiv2.http(apiv2.themes.download)
    );

    router.post('/themes/upload',
        mw.authAdminApi,
        upload.single('theme'),
        shared.middlewares.validation.upload({type: 'themes'}),
        apiv2.http(apiv2.themes.upload)
    );

    router.put('/themes/:name/activate',
        mw.authAdminApi,
        apiv2.http(apiv2.themes.activate)
    );

    router.del('/themes/:name',
        mw.authAdminApi,
        apiv2.http(apiv2.themes.destroy)
    );

    // ## Notifications
    router.get('/notifications', mw.authAdminApi, apiv2.http(apiv2.notifications.browse));
    router.post('/notifications', mw.authAdminApi, apiv2.http(apiv2.notifications.add));
    router.del('/notifications/:notification_id', mw.authAdminApi, apiv2.http(apiv2.notifications.destroy));

    // ## DB
    router.get('/db', mw.authAdminApi, apiv2.http(apiv2.db.exportContent));
    router.post('/db',
        mw.authAdminApi,
        upload.single('importfile'),
        shared.middlewares.validation.upload({type: 'db'}),
        apiv2.http(apiv2.db.importContent)
    );
    router.del('/db', mw.authAdminApi, apiv2.http(apiv2.db.deleteAllContent));
    router.post('/db/backup',
        mw.authenticateClient('Ghost Backup'),
        apiv2.http(apiv2.db.backupContent)
    );

    // ## Mail
    router.post('/mail', mw.authAdminApi, apiv2.http(apiv2.mail.send));
    router.post('/mail/test', mw.authAdminApi, apiv2.http(apiv2.mail.sendTest));

    // ## Slack
    router.post('/slack/test', mw.authAdminApi, apiv2.http(apiv2.slack.sendTest));

    // ## Sessions
    router.get('/session', mw.authAdminApi, api.http(apiv2.session.read));
    // We don't need auth when creating a new session (logging in)
    router.post('/session',
        shared.middlewares.brute.globalBlock,
        shared.middlewares.brute.userLogin,
        api.http(apiv2.session.add)
    );
    router.del('/session', mw.authAdminApi, api.http(apiv2.session.delete));

    // ## Authentication
    router.post('/authentication/passwordreset',
        shared.middlewares.brute.globalReset,
        shared.middlewares.brute.userReset,
        api.http(api.authentication.generateResetToken)
    );
    router.put('/authentication/passwordreset', shared.middlewares.brute.globalBlock, api.http(api.authentication.resetPassword));
    router.post('/authentication/invitation', api.http(api.authentication.acceptInvitation));
    router.get('/authentication/invitation', api.http(api.authentication.isInvitation));
    router.post('/authentication/setup', api.http(api.authentication.setup));
    router.put('/authentication/setup', mw.authAdminApi, api.http(api.authentication.updateSetup));
    router.get('/authentication/setup', api.http(api.authentication.isSetup));

    // ## Images
    // @TODO: remove /uploads/ in favor of /images/ in Ghost 3.x
    router.post('/uploads',
        mw.authAdminApi,
        upload.single('uploadimage'),
        shared.middlewares.validation.upload({type: 'images'}),
        shared.middlewares.image.normalize,
        apiv2.http(apiv2.upload.image)
    );

    router.post('/uploads/profile-image',
        mw.authAdminApi,
        upload.single('uploadimage'),
        shared.middlewares.validation.upload({type: 'images'}),
        shared.middlewares.validation.profileImage,
        shared.middlewares.image.normalize,
        apiv2.http(apiv2.upload.image)
    );

    router.post('/uploads/icon',
        mw.authAdminApi,
        upload.single('uploadimage'),
        shared.middlewares.validation.upload({type: 'icons'}),
        shared.middlewares.validation.blogIcon(),
        apiv2.http(apiv2.upload.image)
    );

    router.post('/images',
        mw.authAdminApi,
        upload.single('uploadimage'),
        shared.middlewares.validation.upload({type: 'images'}),
        shared.middlewares.image.normalize,
        apiv2.http(apiv2.upload.image)
    );

    router.post('/images/profile-image',
        mw.authAdminApi,
        upload.single('uploadimage'),
        shared.middlewares.validation.upload({type: 'images'}),
        shared.middlewares.validation.profileImage,
        shared.middlewares.image.normalize,
        apiv2.http(apiv2.upload.image)
    );

    router.post('/images/icon',
        mw.authAdminApi,
        upload.single('uploadimage'),
        shared.middlewares.validation.upload({type: 'icons'}),
        shared.middlewares.validation.blogIcon(),
        apiv2.http(apiv2.upload.image)
    );

    // ## Invites
    router.get('/invites', mw.authAdminApi, apiv2.http(apiv2.invites.browse));
    router.get('/invites/:id', mw.authAdminApi, apiv2.http(apiv2.invites.read));
    router.post('/invites', mw.authAdminApi, apiv2.http(apiv2.invites.add));
    router.del('/invites/:id', mw.authAdminApi, apiv2.http(apiv2.invites.destroy));

    // ## Redirects (JSON based)
    router.get('/redirects/json', mw.authAdminApi, apiv2.http(apiv2.redirects.download));
    router.post('/redirects/json',
        mw.authAdminApi,
        upload.single('redirects'),
        shared.middlewares.validation.upload({type: 'redirects'}),
        apiv2.http(apiv2.redirects.upload)
    );

    // ## Webhooks (RESTHooks)
    router.post('/webhooks', mw.authAdminApi, apiv2.http(apiv2.webhooks.add));
    router.put('/webhooks/:id', mw.authAdminApi, apiv2.http(apiv2.webhooks.edit));
    router.del('/webhooks/:id', mw.authAdminApi, apiv2.http(apiv2.webhooks.destroy));

    // ## Oembed (fetch response from oembed provider)
    router.get('/oembed', mw.authAdminApi, apiv2.http(apiv2.oembed.read));

    // ## Actions
    router.get('/actions/:type/:id', mw.authAdminApi, apiv2.http(apiv2.actions.browse));

    return router;
};
