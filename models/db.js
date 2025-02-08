const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'educational'
})

// 检查数据库是否连接成功
connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
    } else {
        console.log('数据库连接成功');
    }
});


// 导出数据库连接对象
module.exports = connection;
