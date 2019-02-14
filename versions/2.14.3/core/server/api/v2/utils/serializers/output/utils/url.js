const _ = require('lodash');
const urlService = require('../../../../../../services/url');

const forPost = (id, attrs, options) => {
    attrs.url = urlService.getUrlByResourceId(id, {absolute: true});

    if (attrs.feature_image) {
        attrs.feature_image = urlService.utils.urlFor('image', {image: attrs.feature_image}, true);
    }

    if (attrs.og_image) {
        attrs.og_image = urlService.utils.urlFor('image', {image: attrs.og_image}, true);
    }

    if (attrs.twitter_image) {
        attrs.twitter_image = urlService.utils.urlFor('image', {image: attrs.twitter_image}, true);
    }

    if (attrs.html) {
        const urlOptions = {
            assetsOnly: true
        };

        if (options.absolute_urls) {
            urlOptions.assetsOnly = false;
        }

        attrs.html = urlService.utils.makeAbsoluteUrls(
            attrs.html,
            urlService.utils.urlFor('home', true),
            attrs.url,
            urlOptions
        ).html();
    }

    if (options.columns && !options.columns.includes('url')) {
        delete attrs.url;
    }

    return attrs;
};

const forUser = (id, attrs) => {
    attrs.url = urlService.getUrlByResourceId(id, {absolute: true});

    if (attrs.profile_image) {
        attrs.profile_image = urlService.utils.urlFor('image', {image: attrs.profile_image}, true);
    }

    if (attrs.cover_image) {
        attrs.cover_image = urlService.utils.urlFor('image', {image: attrs.cover_image}, true);
    }

    return attrs;
};

const forTag = (id, attrs) => {
    attrs.url = urlService.getUrlByResourceId(id, {absolute: true});

    if (attrs.feature_image) {
        attrs.feature_image = urlService.utils.urlFor('image', {image: attrs.feature_image}, true);
    }

    return attrs;
};

const forSettings = (attrs) => {
    // @TODO: https://github.com/TryGhost/Ghost/issues/10106
    // @NOTE: Admin & Content API return a different format, need to mappers
    if (_.isArray(attrs)) {
        attrs.forEach((obj) => {
            if (['cover_image', 'logo', 'icon'].includes(obj.key) && obj.value) {
                obj.value = urlService.utils.urlFor('image', {image: obj.value}, true);
            }
        });
    } else {
        if (attrs.cover_image) {
            attrs.cover_image = urlService.utils.urlFor('image', {image: attrs.cover_image}, true);
        }

        if (attrs.logo) {
            attrs.logo = urlService.utils.urlFor('image', {image: attrs.logo}, true);
        }

        if (attrs.icon) {
            attrs.icon = urlService.utils.urlFor('image', {image: attrs.icon}, true);
        }
    }

    return attrs;
};

const forImage = (path) => {
    return urlService.utils.urlFor('image', {image: path}, true);
};

module.exports.forPost = forPost;
module.exports.forUser = forUser;
module.exports.forTag = forTag;
module.exports.forSettings = forSettings;
module.exports.forImage = forImage;
