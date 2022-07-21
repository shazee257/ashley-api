const CategoryModel = require('../models/category');
const fetchCategories = require('../utils/utils');
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

        // find category with parent category
        const parentCategory = await CategoryModel.findOne({ _id: category.parent_id, is_deleted: false });
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
            .populate('parent_id').sort({ createdAt: -1 });

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


// Get all categories with subcategories
exports.getCategoriesWithSubcategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find({ is_deleted: false });
        const categoryList = fetchSubCategories(categories);
        res.status(200).json({
            success: true,
            categories: categoryList,
        });
    } catch (error) {
        next(error);
    }
    return console.log("test");
}

// function to fetch sub categories (recursive)
function fetchSubCategories(categories, parentId = null) {
    const categoryList = [];
    let category;

    if (parentId == null) {
        category = categories.filter((cat) => cat.parent_id == undefined);
    } else {
        category = categories.filter((cat) => cat.parent_id == parentId);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            title: cate.title,
            children: fetchSubCategories(categories, cate._id)
        })
    }
    return categoryList;
}


// Function to fetch Sub-Categories from Category Id
function fetchSubCategoriesFromParentId(categories, parentId) {
    const categoryList = [];
    let category;

    category = categories.filter((cat) => cat.parent_id == parentId);

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            title: cate.title,
            children: fetchSubCategoriesFromParentId(categories, cate._id)
        })
    }
    return categoryList;
}

// Get a category with subcategories
exports.getCategoryWithSubcategories = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOne({ _id: req.params.categoryId, is_deleted: false });
        const categories = await CategoryModel.find({ is_deleted: false });
        const subCategories = fetchSubCategoriesFromParentId(categories, req.params.categoryId);

        let categoryList = [];
        if (category) {
            categoryList = [{
                _id: category._id,
                title: category.title,
                children: subCategories
            }];
        }

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
            category.image = req.file.filename;
            await category.save();
        }
        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
}