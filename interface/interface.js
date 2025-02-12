const express = require('express');
const UserRouter = require('../router/userRouters');
const avatarRoutes = require('../router/avatarRoutes');
const menuRoutes = require('../router/menuRouters');

const router = express.Router();

// 挂载用户路由
router.use('/user', UserRouter);
// 挂载头像路由
router.use('/', avatarRoutes);
// 菜单路由
router.use('/menus', menuRoutes);


module.exports = router;
