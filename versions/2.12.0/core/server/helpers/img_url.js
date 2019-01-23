// Usage:
// `{{img_url feature_image}}`
// `{{img_url profile_image absolute="true"}}`
// Note:
// `{{img_url}}` - does not work, argument is required
//
// Returns the URL for the current object scope i.e. If inside a post scope will return image permalink
// `absolute` flag outputs absolute URL, else URL is relative.

const url = require('url');
const proxy = require('./proxy');
const urlService = proxy.urlService;
const STATIC_IMAGE_URL_PREFIX = `/${urlService.utils.STATIC_IMAGE_URL_PREFIX}`;

module.exports = function imgUrl(attr, options) {
    // CASE: if no attribute is passed, e.g. `{{img_url}}` we show a warning
    if (arguments.length < 2) {
        proxy.logging.warn(proxy.i18n.t('warnings.helpers.img_url.attrIsRequired'));
        return;
    }

    const absolute = options && options.hash && options.hash.absolute;

    const size = options && options.hash && options.hash.size;
    const imageSizes = options && options.data && options.data.config && options.data.config.image_sizes;

    const image = getImageWithSize(attr, size, imageSizes);

    // CASE: if attribute is passed, but it is undefined, then the attribute was
    // an unknown value, e.g. {{img_url feature_img}} and we also show a warning
    if (image === undefined) {
        proxy.logging.warn(proxy.i18n.t('warnings.helpers.img_url.attrIsRequired'));
        return;
    }

    if (image) {
        return urlService.utils.urlFor('image', {image}, absolute);
    }

    // CASE: if you pass e.g. cover_image, but it is not set, then attr is null!
    // in this case we don't show a warning
};

function getImageWithSize(imagePath, requestedSize, imageSizes) {
    if (!imagePath) {
        return imagePath;
    }
    if (!requestedSize) {
        return imagePath;
    }

    const blogUrl = urlService.utils.getBlogUrl();

    if (/https?:\/\//.test(imagePath) && !imagePath.startsWith(blogUrl)) {
        return imagePath;
    } else {
        // CASE: imagePath is a "protocol relative" url e.g. "//www.gravatar.com/ava..."
        //       by resolving the the imagePath relative to the blog url, we can then
        //       detect if the imagePath is external, or internal.
        const resolvedUrl = url.resolve(blogUrl, imagePath);
        if (!resolvedUrl.startsWith(blogUrl)) {
            return imagePath;
        }
    }

    if (!imageSizes || !imageSizes[requestedSize]) {
        return imagePath;
    }

    const {width, height} = imageSizes[requestedSize];

    if (!width && !height) {
        return imagePath;
    }

    const [imgBlogUrl, imageName] = imagePath.split(STATIC_IMAGE_URL_PREFIX);

    const sizeDirectoryName = prefixIfPresent('w', width) + prefixIfPresent('h', height);

    return [imgBlogUrl, STATIC_IMAGE_URL_PREFIX, `/size/${sizeDirectoryName}`, imageName].join('');
}

function prefixIfPresent(prefix, string) {
    return string ? prefix + string : '';
}
