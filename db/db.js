const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'educational',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

// 添加调试信息
console.log('数据库连接池对象:', pool);

module.exports = pool;
