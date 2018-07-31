// # Bootup
// This file needs serious love & refactoring

/**
 * make sure overrides get's called first!
 * - keeping the overrides require here works for installing Ghost as npm!
 *
 * the call order is the following:
 * - root index requires core module
 * - core index requires server
 * - overrides is the first package to load
 */
require('./overrides');

// Module dependencies
var debug = require('ghost-ignition').debug('boot:init'),
    config = require('./config'),
    Promise = require('bluebird'),
    common = require('./lib/common'),
    models = require('./models'),
    permissions = require('./services/permissions'),
    auth = require('./services/auth'),
    dbHealth = require('./data/db/health'),
    GhostServer = require('./ghost-server'),
    scheduling = require('./adapters/scheduling'),
    settings = require('./services/settings'),
    themes = require('./services/themes'),
    urlService = require('./services/url'),

    // Services that need initialisation
    apps = require('./services/apps'),
    xmlrpc = require('./services/xmlrpc'),
    slack = require('./services/slack'),
    webhooks = require('./services/webhooks');

// ## Initialise Ghost
function init() {
    debug('Init Start...');

    var ghostServer, parentApp;

    // Initialize default internationalization, just for core now
    // (settings for language and theme not yet available here)
    common.i18n.init();
    debug('Default i18n done for core');
    models.init();
    debug('models done');

    return dbHealth.check().then(function () {
        debug('DB health check done');
        // Populate any missing default settings
        // Refresh the API settings cache
        return settings.init();
    }).then(function () {
        debug('Update settings cache done');

        common.events.emit('db.ready');

        // Full internationalization for core could be here
        // in a future version with backend translations
        // (settings for language and theme available here;
        // internationalization for theme is done
        // shortly after, when activating the theme)
        //
        // Initialize the permissions actions and objects
        return permissions.init();
    }).then(function () {
        debug('Permissions done');
        return Promise.join(
            themes.init(),
            // Initialize xmrpc ping
            xmlrpc.listen(),
            // Initialize slack ping
            slack.listen(),
            // Initialize webhook pings
            webhooks.listen()
        );
    }).then(function () {
        debug('Apps, XMLRPC, Slack done');

        // Setup our collection of express apps
        parentApp = require('./web/parent-app')();

        // Initialise analytics events
        if (config.get('segment:key')) {
            require('./analytics-events').init();
        }

        debug('Express Apps done');
    }).then(function () {
        /**
         * @NOTE:
         *
         * Must happen after express app bootstrapping, because we need to ensure that all
         * routers are created and are now ready to register additional routes. In this specific case, we
         * are waiting that the AppRouter was instantiated. And then we can register e.g. amp if enabled.
         *
         * If you create a published post, the url is always stronger than any app url, which is equal.
         */
        return apps.init();
    }).then(function () {
        parentApp.use(auth.init());
        debug('Auth done');

        return new GhostServer(parentApp);
    }).then(function (_ghostServer) {
        ghostServer = _ghostServer;

        // scheduling can trigger api requests, that's why we initialize the module after the ghost server creation
        // scheduling module can create x schedulers with different adapters
        debug('Server done');
        return scheduling.init({
            schedulerUrl: config.get('scheduling').schedulerUrl,
            active: config.get('scheduling').active,
            apiUrl: urlService.utils.urlFor('api', true),
            internalPath: config.get('paths').internalSchedulingPath,
            contentPath: config.getContentPath('scheduling')
        });
    }).then(function () {
        debug('Scheduling done');
        debug('...Init End');
        return ghostServer;
    });
}

module.exports = init;
