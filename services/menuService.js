const { getAllMenus } = require('../models/menuModel');

// 构建菜单树形结构
const buildMenuTree = (menus) => {
    if (!Array.isArray(menus)) {
         console.error('传递给 buildMenuTree 的参数不是数组:', menus);
        return [];
    }


    const menuMap = {};
    const rootMenus = [];

    // 先将所有菜单存储到 map 中
    menus.forEach(menu => {
        menu.child = [];
        menuMap[menu.id] = menu;
    });

    // 构建树形结构
    menus.forEach(menu => {
        if (menu.parent_id === null) {
            rootMenus.push(menu);
        } else {
            const parent = menuMap[menu.parent_id];
            if (parent) {
                parent.child.push(menu);
            }
        }
    });

    return rootMenus;
};

// 获取菜单树形结构数据
const getMenuTree = async () => {
    try {
        const menus = await getAllMenus();
        return buildMenuTree(menus);
    } catch (error) {
        console.error('构建菜单树出错:', error);
        throw error;
    }
};

module.exports = {
    getMenuTree
};
