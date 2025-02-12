const { getMenuTree } = require('../services/menuService');

// 获取树形菜单数据的控制器方法menuRouter.js
const getMenuTreeController = async (req, res) => {
    try {
        const menuTree = await getMenuTree();
        res.json(menuTree);
    } catch (error) {
        res.status(500).json({ message: '服务器内部错误' });
    }
};

module.exports = {
    getMenuTreeController
};
