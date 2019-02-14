const _ = require('lodash');
const localUtils = require('../../../index');

const tag = (attrs, frame) => {
    if (localUtils.isContentAPI(frame)) {
        delete attrs.created_at;
        delete attrs.updated_at;

        // We are standardising on returning null from the Content API for any empty values
        if (attrs.meta_title === '') {
            attrs.meta_title = null;
        }
        if (attrs.meta_description === '') {
            attrs.meta_description = null;
        }
        if (attrs.description === '') {
            attrs.description = null;
        }
    }

    // Already deleted in model.toJSON, but leaving here so that we can clean that up when we deprecate v0.1
    delete attrs.parent_id;

    // @NOTE: unused fields
    delete attrs.parent;

    return attrs;
};

const author = (attrs, frame) => {
    if (localUtils.isContentAPI(frame)) {
        // Already deleted in model.toJSON, but leaving here so that we can clean that up when we deprecate v0.1
        delete attrs.created_at;
        delete attrs.updated_at;
        delete attrs.last_seen;
        delete attrs.status;

        // Extra properties removed from v2
        delete attrs.tour;

        // We are standardising on returning null from the Content API for any empty values
        if (attrs.twitter === '') {
            attrs.twitter = null;
        }
        if (attrs.bio === '') {
            attrs.bio = null;
        }
        if (attrs.website === '') {
            attrs.website = null;
        }
        if (attrs.facebook === '') {
            attrs.facebook = null;
        }
        if (attrs.meta_title === '') {
            attrs.meta_title = null;
        }
        if (attrs.meta_description === '') {
            attrs.meta_description = null;
        }
        if (attrs.location === '') {
            attrs.location = null;
        }
    }

    // @NOTE: unused fields
    delete attrs.visibility;
    delete attrs.accessibility;
    delete attrs.locale;
    delete attrs.ghost_auth_id;

    return attrs;
};

const post = (attrs, frame) => {
    if (localUtils.isContentAPI(frame)) {
        // @TODO: https://github.com/TryGhost/Ghost/issues/10335
        // delete attrs.page;
        delete attrs.status;

        // We are standardising on returning null from the Content API for any empty values
        if (attrs.twitter_title === '') {
            attrs.twitter_title = null;
        }
        if (attrs.twitter_description === '') {
            attrs.twitter_description = null;
        }
        if (attrs.meta_title === '') {
            attrs.meta_title = null;
        }
        if (attrs.meta_description === '') {
            attrs.meta_description = null;
        }
        if (attrs.og_title === '') {
            attrs.og_title = null;
        }
        if (attrs.og_description === '') {
            attrs.og_description = null;
        }
    }

    delete attrs.locale;
    delete attrs.visibility;
    delete attrs.author;

    return attrs;
};

const action = (attrs) => {
    if (attrs.actor) {
        delete attrs.actor_id;
        delete attrs.resource_id;

        if (attrs.actor_type === 'user') {
            attrs.actor = _.pick(attrs.actor, ['id', 'name', 'slug', 'profile_image']);
            attrs.actor.image = attrs.actor.profile_image;
            delete attrs.actor.profile_image;
        } else {
            attrs.actor = _.pick(attrs.actor, ['id', 'name', 'slug', 'icon_image']);
            attrs.actor.image = attrs.actor.icon_image;
            delete attrs.actor.icon_image;
        }
    } else if (attrs.resource) {
        delete attrs.actor_id;
        delete attrs.resource_id;

        // @NOTE: we only support posts right now
        attrs.resource = _.pick(attrs.resource, ['id', 'title', 'slug', 'feature_image']);
        attrs.resource.image = attrs.resource.feature_image;
        delete attrs.resource.feature_image;
    }
};

module.exports.post = post;
module.exports.tag = tag;
module.exports.author = author;
module.exports.action = action;
