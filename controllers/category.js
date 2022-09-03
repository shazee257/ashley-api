const CategoryModel = require('../models/category');
const { thumbnail, multiThumbnail } = require('../utils/utils');

// create a new category
exports.createCategory = async (req, res, next) => {
    if (req.file) {
        req.body.image = req.files[0].filename
        // req.body.discount_image = req.files[1].filename
        thumbnail(req, "categories");
    }

    const categoryObj = {
        title: req.body.title,
        image: req.body.image ? req.body.image : "",
        // discount_image: req.body.discount_image ? req.body.discount_image : "",
        parent_id: req.body.parent_id ? req.body.parent_id : "",
        attributes: req.body.attributes ? req.body.attributes.split(',') : [],
    }

    try {
        const category = await CategoryModel.create(categoryObj);
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
            { _id: req.params.id }, { is_deleted: false }
        );

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        if (category.parent_id == '' || category.parent_id == null || category.parent_id == undefined) {
            return res.status(200).json({
                success: true,
                category
            });
        }

        const parentCategory = await CategoryModel.findById(category.parent_id);

        const categoryObj = {
            _id: category._id,
            id: category._id,
            title: category.title,
            image: category.image,
            slug: category.slug,
            discount_image: category.discount_image,
            parent_id: parentCategory ? parentCategory._id : '',
            parent_title: parentCategory ? parentCategory.title : '',
            parent_image: parentCategory ? parentCategory.image : '',
            parent_slug: parentCategory ? parentCategory.slug : '',
            attributes: category.attributes,
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

// Get a category by slug
exports.getCategoryBySlug = async (req, res, next) => {
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
        if (category.parent_id == '' || category.parent_id == null || category.parent_id == undefined) {
            return res.status(200).json({
                success: true,
                category
            });
        }

        const parentCategory = await CategoryModel.findById(category.parent_id);

        const categoryObj = {
            _id: category._id,
            id: category._id,
            title: category.title,
            image: category.image,
            slug: category.slug,
            parent_id: parentCategory ? parentCategory._id : '',
            parent_title: parentCategory ? parentCategory.title : '',
            parent_image: parentCategory ? parentCategory.image : '',
            parent_slug: parentCategory ? parentCategory.slug : '',
            attributes: category.attributes,
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
            .sort({ title: 1 });

        // find each category with parent category
        const categoryList = categories.map((category) => {
            const parentCategory = categories.find((cat) => cat._id == category.parent_id);
            return {
                _id: category._id,
                id: category._id,
                title: category.title,
                image: category.image,
                slug: category.slug,
                discount_image: category.discount_image,
                parent_id: parentCategory ? parentCategory._id : '',
                parent_title: parentCategory ? parentCategory.title : '',
                parent_image: parentCategory ? parentCategory.image : '',
                attributes: category.attributes,
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
        const category = await CategoryModel.findOneAndUpdate({ _id: req.params.id }, { is_deleted: true }, { new: true });

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
        const category = await CategoryModel.findById(req.params.id);

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        category.parent_id = req.body.parent_id ? req.body.parent_id : category.parent_id;
        category.title = req.body.title ? req.body.title : category.title;
        category.attributes = req.body.attributes ? req.body.attributes : [];

        await category.save();

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
exports.uploadCategoryImage = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOne({ _id: req.params.id, is_deleted: false });
        if (req.file) {
            thumbnail(req, "categories");
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

// Get categories with subcategories (not used)
exports.getCategoriesWithSubcategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find({ is_deleted: false })
            .sort({ title: 1 });
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

// Get categories with subcategories recursively
function getCategoriesWithSubcategories(categories, parentCategory) {
    const subCategories = categories.filter((category) => category.parent_id == parentCategory._id);
    if (subCategories.length > 0) {
        parentCategory.children = subCategories.map((subCategory) => {
            return {
                _id: subCategory._id,
                id: subCategory._id,
                title: subCategory.title,
                image: subCategory.image,
                slug: subCategory.slug,
                attributes: subCategory.attributes,
                createdAt: subCategory.createdAt,
                children: getCategoriesWithSubcategories(categories, subCategory)
            }
        });
    }
    return parentCategory.children;
}

// Get all categories with subcategories recursively
exports.getCategoriesWithSubcategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find({ is_deleted: false })
            .sort({ title: 1 });
        const parentCategories = categories.filter((category) => category.parent_id == '');

        const categoryList = parentCategories.map((parentCategory) => {
            return {
                _id: parentCategory._id,
                id: parentCategory._id,
                title: parentCategory.title,
                image: parentCategory.image,
                slug: parentCategory.slug,
                attributes: parentCategory.attributes,
                createdAt: parentCategory.createdAt,
                children: getCategoriesWithSubcategories(categories, parentCategory)
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

//
//
//
//
//
//
//


function getCategoryWithItsSubCategories(categories, parentCategory) {
    const subCategories = categories.filter((category) => category.parent_id == parentCategory._id);
    if (subCategories.length > 0) {
        parentCategory.children = subCategories.map((subCategory) => {
            return {
                _id: subCategory._id,
                id: subCategory._id,
                title: subCategory.title,
                image: subCategory.image,
                slug: subCategory.slug,
                createdAt: subCategory.createdAt,
                children: getCategoryWithItsSubCategories(categories, subCategory)
            }
        });
    }
    return parentCategory.children;
}

exports.getCategoryWithItsSubCategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find({ is_deleted: false });

        const parentCategory = await CategoryModel.findOne({ slug: req.params.slug, is_deleted: false });

        const categoryList = {
            _id: parentCategory._id,
            id: parentCategory._id,
            title: parentCategory.title,
            image: parentCategory.image,
            slug: parentCategory.slug,
            createdAt: parentCategory.createdAt,
            children: getCategoryWithItsSubCategories(categories, parentCategory)
        }

        res.status(200).json({
            success: true,
            category: categoryList,
            message: 'Categories found successfully'
        });
    } catch (error) {
        next(error);
    }
}

// upload discount image
exports.uploadDiscountImage = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOne({ _id: req.params.id, is_deleted: false });
        if (req.file) {
            thumbnail(req, "categories");
            category.discount_image = req.file.filename;
            await category.save();
        }
        res.status(200).json({
            success: true,
            message: 'Discounted Image uploaded successfully',
            category
        });
    } catch (error) {
        next(error);
    }
}