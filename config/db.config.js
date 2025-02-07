const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'educational_management_system',
});

// 链接数据库成功
pool.getConnection((err, connection) => {
    if (err) {
        console.log('链接数据库失败');
        return;
    }
    console.log('链接数据库成功');
    connection.release();
})

// 导出
module.exports = pool;
