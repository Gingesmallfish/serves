const connection = require('../models/db');

// 查询用户名是否存在
function checkUsernameExistence(username) {
  return new Promise((resolve, reject) => {
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkQuery, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        reject('服务器内部错误');
      }
      resolve(results);
    });
  });
}

// 插入新用户
function insertUser(username, hashedPassword, role) {
  return new Promise((resolve, reject) => {
    const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    connection.query(insertQuery, [username, hashedPassword, role], (err, results) => {
      if (err) {
        console.error('Database insertion error:', err);
        reject('服务器内部错误');
      }
      resolve(results);
    });
  });
}

// 根据用户名查找用户
function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        reject('服务器内部错误');
      }
      resolve(results);
    });
  });
}

module.exports = {
  checkUsernameExistence,
  insertUser,
  findUserByUsername,
};
