// services/avatarService.js
const path = require('path');
const db = require('../db/db');  // 假设你有一个 models.js 用于操作数据库

// 保存头像的服务
const saveAvatar = (userId, file) => {
  const avatarUrl = `/uploads/${file.filename}`;

  // 更新数据库中的 avatar 字段
  const query = 'UPDATE users SET avatar = ? WHERE user_id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [avatarUrl, userId], (err, result) => {
      if (err) {
        return reject('更新头像失败');
      }
      resolve(avatarUrl); // 返回头像 URL
    });
  });
};

// 获取头像的服务
const getAvatar = (userId) => {
  const query = 'SELECT avatar FROM users WHERE user_id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, result) => {
      if (err) {
        return reject('查询头像失败');
      }
      if (result.length === 0) {
        return reject('用户未找到');
      }
      // 如果用户没有设置头像，返回默认头像
      resolve(result[0].avatar || '/uploads/default-avatar.jpg');
    });
  });
};

module.exports = { saveAvatar, getAvatar };
