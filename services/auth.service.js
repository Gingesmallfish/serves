const jwt = require('jsonwebtoken');
const pool = require('../config/db.config');

// 验证验证码
const verifyCaptcha = (captcha, sessionCaptcha) => {
    return captcha === sessionCaptcha;
};

// 查询用户信息
const findUserByCredentials = async (username, password) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

//注册用户
const registerUSer = async (username,password, role) => {
    try {
        await pool.execute('INSERT INTO users (username, password, role) VALUES (?,?,?)', [username, password, role]);
        return true;
    }catch (error) {
        throw error;
    }
}

// 生成 JWT 令牌
const generateToken = (userId) => {
    return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
};

module.exports = {
    verifyCaptcha,
    registerUSer,
    findUserByCredentials,
    generateToken
};
