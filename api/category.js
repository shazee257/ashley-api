const router = require('express').Router();

// const { Auth}  = require('../middlewares/auth');

const {
    createCategory, getCategoriesWithSubcategories,
    deleteCategory, updateCategory, getCategoryWithSubcategories,
    getCategory, getCategories

} = require('../controllers/category');

// Add a category
router.post('/', createCategory);

// Get all categories
router.get('/', getCategories);

// Get a category with subcategories
router.get('/fetch/:categoryId', getCategoryWithSubcategories);

// Get all categories with subcategories
router.get('/fetch', getCategoriesWithSubcategories);

// Get a cateogry
router.get('/:slug', getCategory);

// Delete a category
router.delete('/:slug', deleteCategory);

// Update a category
router.put('/:slug', updateCategory);


module.exports = router;