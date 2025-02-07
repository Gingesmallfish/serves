const express = require('express');
const loginMiddleware = require('../middleware/login.middleware');
const registerMiddleware = require('../middleware/register.middleware');
const router = express.Router();

router.post('/login', loginMiddleware);

router.post('/register', registerMiddleware);

module.exports = router;
