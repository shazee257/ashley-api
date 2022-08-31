const ReviewsModel = require('../models/reviews');
const ProductModel = require('../models/product');

// Add new reviews
exports.addReviews = async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({
            success: false,
            message: 'Please upload attachments'
        });
    }

    const images = req.files.map(image => image.filename);

    let reviewsObj = {
        title: req.body.title,
        description: req.body.description,
        images: images,
        rating: req.body.rating,
        user_id: req.body.user_id,
        product_id: req.params.productId,
    }

    try {
        const reviews = await ReviewsModel.create(reviewsObj);
        const product = await ProductModel.findOne({ _id: req.params.productId, is_deleted: false });

        const productReviews = await ReviewsModel.find({ product_id: req.params.productId, is_deleted: false });
        const productRating = productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length;
        product.rating = productRating;

        await product.save();
        return res.status(200).json({
            success: true,
            message: 'Reviews added successfully',
            reviews
        });

    } catch (error) {
        next(error);
    }
};

// get all reviews
exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await ReviewsModel.find({ product_id: req.params.productId });

        return res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        next(error);
    }
}