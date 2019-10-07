module.exports = {
    get authorize() {
        return require('./authorize');
    },

    get authenticate() {
        return require('./authenticate');
    },

    get session() {
        return require('./session');
    },

    get setup() {
        return require('./setup');
    },

    get passwordreset() {
        return require('./passwordreset');
    },

    /*
     * TODO: Get rid of these when v0.1 is gone
     */
    get init() {
        return (options) => {
            require('./oauth').init(options);
            return require('./passport').init(options);
        };
    },
    get oauth() {
        return require('./oauth');
    }
};
