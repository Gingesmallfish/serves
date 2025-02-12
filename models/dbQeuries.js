// dbQery.js
const pool = require('../db/db');

// 查询用户名是否存在
async function checkUsernameExistence(username) {
    try {
        const [results] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return results;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('服务器内部错误');
    }
}

// 插入新用户
async function insertUser(username, hashedPassword, role, name, sex, phone) {
    try {
        const [results] = await pool.execute('INSERT INTO users (username, password, role, name, sex, phone) VALUES (?, ?, ?, ?, ?, ?)', [username, hashedPassword, role, name, sex, phone]);
        return results;
    } catch (error) {
        console.error('数据插入失败', error);
        throw new Error('服务器内部错误');
    }
}

// 根据用户名查找用户
async function findUserByUsername(username) {
    try {
        const [results] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return results;
    } catch (error) {
        console.error('用户查找失败:', error);
        throw new Error('服务器内部错误');
    }
}

module.exports = {
    checkUsernameExistence,
    insertUser,
    findUserByUsername
};
