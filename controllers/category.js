const { default: mongoose } = require('mongoose');
const CategoryModel = require('../models/category');
const { thumbnail } = require('../utils/utils');

// create a new category
exports.createCategory = async (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.filename
        thumbnail(req);
    }

    try {
        const category = await CategoryModel.create(req.body);
        res.status(200).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// Get a category
exports.getCategory = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOne(
            { slug: req.params.slug }, { is_deleted: false }
        );

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // find category with parent category
        const parentCategory = await CategoryModel.findOne({ _id: category?.parent_id });

        // _id: category.parent_id, is_deleted: false });
        const categoryObj = {
            _id: category._id,
            id: category._id,
            title: category.title,
            image: category.image,
            slug: category.slug,
            parent_id: parentCategory ? parentCategory._id : '',
            parent_title: parentCategory ? parentCategory.title : '',
            createdAt: category.createdAt,
        }

        res.status(200).json({
            success: true,
            category: categoryObj
        });
    } catch (error) {
        next(error);
    }
}

// Get all categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find({ is_deleted: false })
            .sort({ createdAt: -1 });

        // find each category with parent category
        const categoryList = categories.map((category) => {
            const parentCategory = categories.find((cat) => cat._id == category.parent_id);
            return {
                _id: category._id,
                id: category._id,
                title: category.title,
                image: category.image,
                slug: category.slug,
                parent_id: parentCategory ? parentCategory._id : '',
                parent_title: parentCategory ? parentCategory.title : '',
                parent_image: parentCategory ? parentCategory.image : '',
                createdAt: category.createdAt,
            }
        });

        res.status(200).json({
            success: true,
            categories: categoryList
        });
    } catch (error) {
        next(error);
    }
}

// Delete a category
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOneAndUpdate({ slug: req.params.slug }, { is_deleted: true }, { new: true });

        res.status(200).json({
            success: true,
            category,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

// Update a category
exports.updateCategory = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOneAndUpdate(
            { slug: req.params.slug },
            req.body, { new: true }
        );
        res.status(200).json({
            success: true,
            category,
            message: 'Category updated successfully'
        });
    } catch (error) {
        next(error);
    }
}

// upload image
exports.uploadImage = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug, is_deleted: false });
        if (req.file) {
            thumbnail(req);
            category.image = req.file.filename;
            await category.save();
        }
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            category
        });
    } catch (error) {
        next(error);
    }
}

// Get categories with subcategories
exports.getCategoriesWithSubcategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find({ is_deleted: false });
        const parentCategories = categories.filter((category) => category.parent_id == '');

        const categoryList = parentCategories.map((parentCategory) => {
            const subCategories = categories.filter((category) => category.parent_id == parentCategory._id);
            return {
                _id: parentCategory._id,
                id: parentCategory._id,
                title: parentCategory.title,
                image: parentCategory.image,
                slug: parentCategory.slug,
                createdAt: parentCategory.createdAt,
                children: subCategories.map((subCategory) => {
                    return {
                        _id: subCategory._id,
                        id: subCategory._id,
                        title: subCategory.title,
                        image: subCategory.image,
                        slug: subCategory.slug,
                        createdAt: subCategory.createdAt,
                    }
                }),
            }
        });


        res.status(200).json({
            success: true,
            categories: categoryList,
            message: 'Categories found successfully'
        });
    } catch (error) {
        next(error);
    }
}
