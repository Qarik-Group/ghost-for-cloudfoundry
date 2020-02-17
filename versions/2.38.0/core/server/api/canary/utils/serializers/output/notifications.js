const debug = require('ghost-ignition').debug('api:canary:utils:serializers:output:notifications');

module.exports = {
    all(response, apiConfig, frame) {
        if (!response) {
            return;
        }

        if (!response || !response.length) {
            frame.response = {
                notifications: []
            };

            return;
        }

        response.forEach((notification) => {
            delete notification.seen;
            delete notification.seenBy;
            delete notification.addedAt;
        });

        frame.response = {
            notifications: response
        };

        debug(frame.response);
    }
};
