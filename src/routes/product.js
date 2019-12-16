const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Test products' });
});

module.exports = router;