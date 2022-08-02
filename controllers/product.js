const ProductModel = require('../models/product');
const { multiThumbnail } = require('../utils/utils');

exports.createProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.create(req.body);
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const products = await ProductModel.find({ is_deleted: false })
            .populate('category_id brand_id store_id')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        next(error);
    }
}

// re-check the code
exports.uploadImages = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }


        const images = req.files;

        // save uploaded images name in database
        if (is_sizes && images) {
            product.attr.forEach((attr) => {
                attr.features.forEach((feature) => {
                    if (feature._id.toString() === req.params.featureId) {
                        feature.images = images.map((image) => image.filename);
                    }
                })
            });
        } else {
            if (images) {
                product.colors.forEach((color) => {
                    if (color._id.toString() === req.params.featureId) {
                        color.images = images.map((image) => image.filename);
                    }
                });
            }
        }

        await product.save();
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
}

// add new feature to product
exports.addFeature = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const isVariableSize = product.is_variable;
        const images = req.files.map((image) => image.filename);

        multiThumbnail(req);

        const feature = {
            color: req.body.color,
            quantity: req.body.quantity,
            sku: req.body.sku,
            images: images,
        };

        // add multiple features to product sizes
        if (isVariableSize) {
            product.variants.forEach((v) => {
                if (v._id.toString() === req.params.variantId) {
                    // check feature is already exist or not
                    const isExist = v.features.find((f) => f.color === feature.color);
                    if (isExist) {
                        return res.status(400).json({ success: false, message: 'Feature already exist' });
                    }
                    v.features.push(feature);
                }
            });
        };

        // add feature to product with colors
        if (!isVariableSize) {
            product.colors.push(feature);
            product.price = req.body.price;
        };

        await product.save();
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

// add variant to product
exports.addVariant = async (req, res, next) => {
    // check empty fields
    if (!req.body.size || !req.body.price) {
        return res.status(400).json({ success: false, message: 'Size and price are required' });
    }

    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) res.status(404).json({ success: false, message: 'Product not found' });

        const variant = {
            size: req.body.size,
            sale_price: req.body.sale_price,
            actual_price: req.body.actual_price,
        };

        // check variant is already exist or not
        const isExist = product.variants.find((v) => v.size === variant.size);
        if (isExist) {
            return res.status(400).json({ success: false, message: 'Variant already exist' });
        }
        product.variants.push(variant);
        await product.save();
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

// get product by slug
exports.getProductBySlug = async (req, res, next) => {
    try {
        const product = await ProductModel.findOne({ slug: req.params.slug, is_deleted: false })
            .populate('category_id brand_id store_id')
            .sort({ createdAt: -1 });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }







}


