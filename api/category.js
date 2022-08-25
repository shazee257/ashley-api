const router = require('express').Router();
const { upload } = require('../utils/utils');

const {
    createCategory,
    getCategoriesWithSubcategories,
    getCategoryWithItsSubCategories,
    deleteCategory, updateCategory,

    getCategory,

    getCategoryBySlug,

    getCategories,
    uploadCategoryImage

} = require('../controllers/category');

router.post('/', upload("categories").array('image'), createCategory);
router.post('/upload-image/:id', upload("categories").single('image'), uploadCategoryImage);

router.get('/', getCategories);
router.get('/c/:slug', getCategoryWithItsSubCategories);            // find category with its subcategories (nested levels)
router.get('/:id', getCategory);
router.get('/slug/:slug', getCategoryBySlug);                       // find category by slug with parent category
router.get('/fetch/categories', getCategoriesWithSubcategories);    // find all categories with subcategories (nested levels)

// Delete a category
router.delete('/:id', deleteCategory);

// Update a category
router.put('/:id', updateCategory);


module.exports = router;