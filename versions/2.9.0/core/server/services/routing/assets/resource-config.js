/* eslint-disable */
module.exports.QUERY = {
    tag: {
        alias: 'tags',
        type: 'read',
        resource: 'tags',
        options: {
            slug: '%s',
            visibility: 'public'
        }
    },
    author: {
        alias: 'authors',
        type: 'read',
        resource: 'users',
        options: {
            slug: '%s',
            visibility: 'public'
        }
    },
    user: {
        alias: 'authors',
        type: 'read',
        resource: 'users',
        options: {
            slug: '%s',
            visibility: 'public'
        }
    },
    post: {
        alias: 'posts',
        type: 'read',
        resource: 'posts',
        options: {
            slug: '%s',
            status: 'published',
            page: 0
        }
    },
    page: {
        alias: 'pages',
        type: 'read',
        resource: 'posts',
        options: {
            slug: '%s',
            status: 'published',
            page: 1
        }
    }
};

module.exports.TAXONOMIES = {
    tag: {
        filter: 'tags:\'%s\'+tags.visibility:public',
        editRedirect: '#/settings/tags/:slug/'
    },
    author: {
        filter: 'authors:\'%s\'',
        editRedirect: '#/team/:slug/'
    }
};
/* eslint-enable */
