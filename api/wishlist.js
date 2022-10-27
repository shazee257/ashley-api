const router = require('express').Router();

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} = require('../controllers/wishlist');

router.get("/:userId", getWishlist);
router.post("/:userId", addToWishlist);
router.put("/:userId", removeFromWishlist);

module.exports = router;