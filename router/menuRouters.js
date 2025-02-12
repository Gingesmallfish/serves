const express = require('express');
const router = express.Router();
const { getMenuTreeController } = require('../controller/menuController');

// 获取树形菜单数据的路由
router.get('/tree', getMenuTreeController);

module.exports = router;
