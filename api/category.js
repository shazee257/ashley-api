const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createCategory,
    getCategoriesWithSubcategories,
    getCategoryWithItsSubCategories,
    deleteCategory, updateCategory,

    getCategory,
    getCategories,
    uploadCategoryImage

} = require('../controllers/category');

// Add a category
router.post('/', upload("categories").single("image"), createCategory);

// upload image
router.post('/upload-image/:slug', upload("categories").single('image'), uploadCategoryImage);

// Get all categories
router.get('/', getCategories);

// Get a cateogry
// router.get('/:slug', getCategoryWithItsSubCategories);
router.get('/:id', getCategory);

// router.get('/c/:id', getCategory);

// Get categories with subcategories
router.get('/fetch/subcategories', getCategoriesWithSubcategories);

// Delete a category
router.delete('/:slug', deleteCategory);

// Update a category
router.put('/:id', updateCategory);


module.exports = router;