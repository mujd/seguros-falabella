const { Router } = require('express');
const router = Router();

router.use('/product', require('./product'));

module.exports = router;