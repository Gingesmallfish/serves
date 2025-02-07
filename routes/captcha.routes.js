const express = require('express');
const captchaMiddleware = require('../middleware/captcha.middleware');
const router = express.Router();
router.post('/captcha', captchaMiddleware);

module.exports = router;
