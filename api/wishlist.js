const router = require('express').Router();

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} = require('../controllers/wishlist');

router.post("/:userId/:productId", addToWishlist);
router.get("/:userId", getWishlist);
router.put("/:userId/:productId", removeFromWishlist);

module.exports = router;