const debug = require('ghost-ignition').debug('api:shared:headers');
const INVALIDATE_ALL = '/*';

const cacheInvalidate = (result, options = {}) => {
    let value = options.value;

    return {
        'X-Cache-Invalidate': value || INVALIDATE_ALL
    };
};

const disposition = {
    csv(result, options = {}) {
        let value = options.value;

        if (typeof options.value === 'function') {
            value = options.value();
        }

        return {
            'Content-Disposition': value,
            'Content-Type': 'text/csv'
        };
    },

    json(result, options = {}) {
        return {
            'Content-Disposition': options.value,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(result))
        };
    },

    yaml(result, options = {}) {
        return {
            'Content-Disposition': options.value,
            'Content-Type': 'application/yaml',
            'Content-Length': Buffer.byteLength(JSON.stringify(result))
        };
    }
};

module.exports = {
    get(result, apiConfig = {}) {
        let headers = {};

        if (apiConfig.disposition) {
            Object.assign(headers, disposition[apiConfig.disposition.type](result, apiConfig.disposition));
        }

        if (apiConfig.cacheInvalidate) {
            Object.assign(headers, cacheInvalidate(result, apiConfig.cacheInvalidate));
        }

        debug(headers);
        return headers;
    }
};
