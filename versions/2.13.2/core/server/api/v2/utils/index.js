module.exports = {
    get permissions() {
        return require('./permissions');
    },

    get serializers() {
        return require('./serializers');
    },

    get validators() {
        return require('./validators');
    },

    /**
     *  TODO: We need to check for public context as permission stage overrides
     * the whole context object currently: https://github.com/TryGhost/Ghost/issues/10099
     */
    isContentAPI: (frame) => {
        return !!(Object.keys(frame.options.context).length === 0 ||
                    (!frame.options.context.user && frame.options.context.api_key && (frame.options.context.api_key.type === 'content')) ||
                    frame.options.context.public
        );
    },

    isAdminAPIKey: (frame) => {
        return frame.options.context && Object.keys(frame.options.context).length !== 0 && frame.options.context.api_key &&
            frame.options.context.api_key.type === 'admin';
    }
};
