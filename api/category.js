const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createCategory,
    getCategoriesWithSubcategoriesRecursively,
    deleteCategory, updateCategory,
    getCategory, getCategories,
    uploadCategoryImage

} = require('../controllers/category');

// Add a category
router.post('/', upload("categories").single("image"), createCategory);

// upload image
router.post('/upload-image/:slug', upload("categories").single('image'), uploadCategoryImage);

// Get all categories
router.get('/', getCategories);

// Get a cateogry
router.get('/:slug', getCategory);

// Get categories with subcategories
router.get('/fetch/subcategories', getCategoriesWithSubcategoriesRecursively);

// Delete a category
router.delete('/:slug', deleteCategory);

// Update a category
router.put('/:slug', updateCategory);


module.exports = router;