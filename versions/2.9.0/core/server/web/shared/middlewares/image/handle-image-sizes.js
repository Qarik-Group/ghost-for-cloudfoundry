const path = require('path');
const image = require('../../../../lib/image');
const storage = require('../../../../adapters/storage');
const activeTheme = require('../../../../services/themes/active');

const SIZE_PATH_REGEX = /^\/size\/([^/]+)\//;

module.exports = function (req, res, next) {
    if (!SIZE_PATH_REGEX.test(req.url)) {
        return next();
    }

    const [sizeImageDir, requestedDimension] = req.url.match(SIZE_PATH_REGEX);
    const redirectToOriginal = () => {
        const url = req.originalUrl.replace(`/size/${requestedDimension}`, '');
        return res.redirect(url);
    };

    const imageSizes = activeTheme.get().config('image_sizes');
    // CASE: no image_sizes config
    if (!imageSizes) {
        return redirectToOriginal();
    }

    const imageDimensions = Object.keys(imageSizes).reduce((dimensions, size) => {
        const {width, height} = imageSizes[size];
        const dimension = (width ? 'w' + width : '') + (height ? 'h' + height : '');
        return Object.assign({
            [dimension]: imageSizes[size]
        }, dimensions);
    }, {});

    const imageDimensionConfig = imageDimensions[requestedDimension];
    // CASE: unknown dimension
    if (!imageDimensionConfig || (!imageDimensionConfig.width && !imageDimensionConfig.height)) {
        return redirectToOriginal();
    }

    const storageInstance = storage.getStorage();
    // CASE: unsupported storage adapter but theme is using custom image_sizes
    if (typeof storageInstance.saveRaw !== 'function') {
        return redirectToOriginal();
    }

    storageInstance.exists(req.url).then((exists) => {
        if (exists) {
            return;
        }

        const originalImagePath = path.relative(sizeImageDir, req.url);

        return storageInstance.read({path: originalImagePath})
            .then((originalImageBuffer) => {
                return image.manipulator.resizeImage(originalImageBuffer, imageDimensionConfig);
            })
            .then((resizedImageBuffer) => {
                return storageInstance.saveRaw(resizedImageBuffer, req.url);
            });
    }).then(() => {
        next();
    }).catch(function (err) {
        if (err.code === 'SHARP_INSTALLATION') {
            return redirectToOriginal();
        }
        next(err);
    });
};
