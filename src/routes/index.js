const { Router } = require('express');
const router = Router();

router.use('/product', require('./product'));
router.use('/soldProduct', require('./soldProduct'));

module.exports = router;