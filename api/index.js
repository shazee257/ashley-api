const apiRouter = require('express').Router();


apiRouter.use('/brands', require('./brand'));
apiRouter.use('/categories', require('./category'));
apiRouter.use('/stores', require('./store'));


apiRouter.use('/users', require('./user'));
// apiRouter.use('/sellers', require('./seller'));
apiRouter.use('/products', require('./product'));


module.exports = apiRouter;