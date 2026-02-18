const multer = require('multer');
const path = require('path');

/**
 * Factory function — retourne un middleware multer pour le dossier indiqué.
 * Usage : const upload = createUpload('products');
 *         router.post('/', upload.single('image'), ...);
 */
const createUpload = (folder) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${folder}`);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'IMG-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Format not supported. Upload only images.'), false);
        }
    };

    return multer({ storage, fileFilter });
};

module.exports = createUpload;