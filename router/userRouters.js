const express = require('express')
const router = express.Router()
const { getCaptcha, register, login} = require('../controller/UserController'); // 引入 UserController

// 获取验证码接口
router.get('/captcha', getCaptcha);

// 注册接口
router.post('/register', register);

// 登录接口
router.post('/login', login);


module.exports = router
