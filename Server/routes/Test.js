const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'This is the test API' });
});

module.exports = router;
