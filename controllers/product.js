const ProductModel = require('../models/product');
const CategoryModel = require('../models/category');
const { multiThumbnail } = require('../utils/utils');

exports.createProduct = async (req, res, next) => {
    const category = await CategoryModel.findById(req.body.category_id);

    let is_sizes_with_colors = false, is_colors_only = false, is_sizes_only = false;
    if (category.attributes.includes("Size") && category.attributes.includes("Color")) {
        is_sizes_with_colors = true;
    } else if (category.attributes.includes("Color") && !category.attributes.includes("Size")) {
        is_colors_only = true;
    } else if (category.attributes.includes("Size") && !category.attributes.includes("Color")) {
        is_sizes_only = true;
    }

    if (!is_sizes_with_colors && !is_colors_only && !is_sizes_only) {
        return res.status(400).json({
            message: "Product must have at least one attribute (Size or Color)"
        });
    }

    const title = req.body.title;
    const store_id = req.body.store_id;
    const category_id = req.body.category_id;
    const brand_id = req.body.brand_id;

    try {
        const product = await ProductModel.create({
            title,
            store_id,
            category_id,
            brand_id,
            is_sizes_with_colors,
            is_colors_only,
            is_sizes_only,
        });
        res.status(200).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        next(error);
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const products = await ProductModel.find({ is_deleted: false })
            .populate('category_id brand_id store_id variants.features.color_id')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        next(error);
    }
}

// re-check the code
exports.uploadImages = async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({
            message: "No files were uploaded"
        });
    }

    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        multiThumbnail(req, "products");
        const images = req.files;

        product.variants.forEach((v) => {
            if (v._id.toString() === req.params.variantId) {
                v.features.forEach((f) => {
                    if (f._id.toString() === req.params.featureId) {
                        images.map(image => f.images.push(image.filename));
                    }
                });
            }
        })

        await product.save();
        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            product
        });
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

        let feature;
        // console.log("req.files typeof: ", typeof (req.files));
        // return console.log("req.files: ", req.files);

        if (req.files) {
            const images = req.files.map((image) => image.filename);
            multiThumbnail(req, "products");

            feature = {
                color_id: req.body.color_id,
                quantity: req.body.quantity,
                sku: req.body.sku,
                images: images,
            };
        } else {
            feature = {
                color_id: req.body.color_id,
                quantity: req.body.quantity,
                sku: req.body.sku,
            };
        }

        // add multiple features to product sizes
        product.variants.forEach((v) => {
            if (v._id.toString() === req.params.variantId) {
                if (v.features.length < 1) {
                    v.features.push(feature);
                } else {
                    // check feature is already exist or not
                    const isExist = v.features.find((f) => f.color_id.toString() === req.body.color_id);
                    if (isExist) {
                        return res.status(409).json({ success: false, message: 'Feature already exist' });
                    }
                    v.features.push(feature);
                }
            }
        });


        await product.save();
        res.status(200).json({
            success: true,
            message: 'Feature added successfully',
            product
        });
    } catch (error) {
        next(error);
    }
}

// add variant to product
exports.addVariant = async (req, res, next) => {
    // check empty fields
    if (!req.body.size || !req.body.sale_price) {
        return res.status(400).json({ success: false, message: 'Size and price are required' });
    }

    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) res.status(404).json({ success: false, message: 'Product not found' });

        // product with sizes and colors
        if (product.is_sizes_with_colors) {
            const variant = {
                size: req.body.size,
                sale_price: req.body.sale_price,
                purchase_price: req.body.purchase_price,
                description: req.body.description,
                dimensions: req.body.dimensions,
            };
            // check variant is already exist or not
            const isExist = product.variants.find((v) => v.size === variant.size);
            if (isExist) {
                return res.status(400).json({ success: false, message: 'Variant already exist' });
            }
            product.variants.push(variant);
            await product.save();
            return res.status(200).json({
                success: true,
                message: 'Variant created successfully',
                product
            });
        }

    } catch (error) {
        next(error);
    }
}

// get product by slug
exports.getProductBySlug = async (req, res, next) => {
    try {
        const product = await ProductModel.findOne({ slug: req.params.slug, is_deleted: false })
            .populate('category_id brand_id store_id variants.features.color_id')
            .sort({ createdAt: -1 });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

// get product by id
exports.getProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findOne({ _id: req.params.id, is_deleted: false })
            .populate('category_id brand_id store_id variants.features.color_id')
            .sort({ createdAt: -1 });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

// get product variants by product id
exports.getProductVariants = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.is_sizes_with_colors) {
            const variants = product.variants.map((v) => {
                return {
                    description: v.description,
                    dimensions: v.dimensions,
                    size: v.size,
                    sale_price: v.sale_price,
                    purchase_price: v.purchase_price,
                    features: v.features
                }
            });
            res.status(200).json({ success: true, variants });

        }
        // res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

// update product by id
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.title = req.body.title;
        product.category_id = req.body.category_id;
        product.brand_id = req.body.brand_id;
        product.store_id = req.body.store_id;

        await product.save();
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

// delete product by id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.is_deleted = true;
        await product.save();
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

// delete variant by id
exports.deleteVariant = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variant = product.variants.find((v) => v._id.toString() === req.params.variantId);
        // if product variant contains features already, then dont delete it
        if (variant.features.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Variant has features, please delete features first'
            });
        }

        product.variants.pull(variant);
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Variant deleted successfully',
            product
        });
    } catch (error) {
        next(error);
    }
}

// update variant by id
exports.updateVariant = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variant = product.variants.find((v) => v._id.toString() === req.params.variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        variant.size = req.body.size;
        variant.sale_price = req.body.sale_price;
        variant.purchase_price = req.body.purchase_price;
        variant.description = req.body.description;
        variant.dimensions = req.body.dimensions;
        await product.save();
        res.status(200).json({
            success: true,
            message: 'Variant updated successfully',
            product
        });
    } catch (error) {
        next(error);
    }
}

// delete feature by id
exports.deleteFeature = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variant = product.variants.find((v) => v._id.toString() === req.params.variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        const feature = variant.features.find((f) => f._id.toString() === req.params.featureId);
        if (!feature) {
            return res.status(404).json({ success: false, message: 'Feature not found' });
        }

        variant.features.pull(feature);
        await product.save();
        res.status(200).json({
            success: true,
            message: 'Product variant feature deleted successfully',
            product
        });
    } catch (error) {
        next(error);
    }
}

// update feature by id
exports.updateFeature = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variant = product.variants.find((v) => v._id.toString() === req.params.variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        const feature = variant.features.find((f) => f._id.toString() === req.params.featureId);
        if (!feature) {
            return res.status(404).json({ success: false, message: 'Feature not found' });
        }

        feature.color_id = req.body.color_id;
        feature.quantity = req.body.quantity;
        feature.sku = req.body.sku;

        await product.save();
        res.status(200).json({
            success: true,
            message: 'Product variant feature updated successfully',
            product
        });
    } catch (error) {
        next(error);
    }
}

// get featured products
exports.getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await ProductModel.find({ is_featured: true, is_deleted: false });
        res.status(200).json({ success: true, products });
    } catch (error) {
        next(error);
    }
}