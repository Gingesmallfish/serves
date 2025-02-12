const pool = require('../db/db')

// 查询所有菜单数据
const getAllMenus = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM menus');
        console.log('查询到的菜单数据:', rows); // 添加日志
        return rows;
    } catch (error) {
        console.error('查询菜单数据出错:', error);
        throw error;
    }
};

module.exports = {
    getAllMenus
}
