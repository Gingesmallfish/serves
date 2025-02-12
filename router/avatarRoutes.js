// routes/avatarRoutes.js
const express = require('express');
const router = express.Router();
const { upload, uploadAvatar, getUserAvatar } = require('../controller/AvatarController');

// 上传头像路由
router.post('/upload', upload.single('avatar'), uploadAvatar);

// 获取头像路由
router.get('/avatar', getUserAvatar);

module.exports = router;
