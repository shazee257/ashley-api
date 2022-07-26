const apiRouter = require('express').Router();


apiRouter.use('/brands', require('./brand'));
apiRouter.use('/categories', require('./category'));
apiRouter.use('/stores', require('./store'));
apiRouter.use('/users', require('./user'));
apiRouter.use('/products', require('./product'));
apiRouter.use('/cart', require('./cart'));

apiRouter.use('/sliders', require('./slider'));


module.exports = apiRouter;