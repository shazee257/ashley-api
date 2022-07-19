const ProductModel = require('../models/product');

exports.createProduct = async (req, res) => {
    const product = await ProductModel.create(req.body);
    res.status(200).json({ success: true, product });
}

exports.getProducts = async (req, res) => {
    const products = await ProductModel.find({ is_deleted: false })
        .populate('category_id brand_id store_id')
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
}

exports.uploadImages = async (req, res) => {
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
}