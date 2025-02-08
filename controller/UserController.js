const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getCaptcha } = require('../utils/captcha');
const connection = require('../config/db');

const JWT_SECRET = 'token-admin';

// 获取验证码
exports.getCaptcha = (req, res) => {
  const captcha = getCaptcha();
  req.session.captcha = captcha.text; // 将验证码文本存储在 session 中
  req.session.captchaTime = Date.now(); // 存储验证码生成时间
  res.type('svg');
  res.status(200).send(captcha.data);
  console.log(req.session.captcha)
};

// 注册用户
// 注册用户
exports.register = (req, res) => {
  const { username, password, confirmPassword, role, captcha } = req.body;

  console.log('Received registration data:', req.body); // 添加日志输出

  // 验证用户名、密码、确认密码是否一致
  if (!username || !password || !confirmPassword || !role || !captcha) {
    console.log('Missing required fields'); // 添加日志输出
    return res.status(400).json({ message: '所有字段都是必填项' });
  }

  if (password !== confirmPassword) {
    console.log('Password and confirm password do not match'); // 添加日志输出
    return res.status(400).json({ message: '密码和确认密码不一致' });
  }

  // 验证验证码
  if (!req.session.captcha || !req.session.captchaTime) {
    console.log('Captcha or captcha time is missing in session'); // 添加日志输出
    return res.status(400).json({ message: '验证码已过期或无效' });
  }

  const captchaTime = req.session.captchaTime;
  const currentTime = Date.now();
  const twoMinutes = 10 * 60 * 1000; // 验证码有效时间为2分钟

  if (currentTime - captchaTime > twoMinutes) {
    console.log('Captcha has expired'); // 添加日志输出
    return res.status(400).json({ message: '验证码已过期' });
  }

  if (req.session.captcha !== captcha) {
    console.log('Captcha does not match'); // 添加日志输出
    return res.status(400).json({ message: '验证码错误' });
  }

  // 验证用户角色
  if (role !== 1 && role !== 2) {
    console.log('Invalid user role'); // 添加日志输出
    return res.status(400).json({ message: '用户角色无效' });
  }

  // 检查用户名是否已存在
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err); // 添加详细错误日志
      return res.status(500).json({ message: '服务器内部错误' });
    }
    if (results.length > 0) {
      console.log('Username already exists'); // 添加日志输出
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 加密密码
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Password hashing error:', err); // 添加详细错误日志
        return res.status(500).json({ message: '服务器内部错误' });
      }

      // 插入新用户
      const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      connection.query(insertQuery, [username, hashedPassword, role], (err, results) => {
        if (err) {
          console.error('Database insertion error:', err); // 添加详细错误日志
          return res.status(500).json({ message: '服务器内部错误' });
        }
        console.log('User registered successfully'); // 添加日志输出
        res.json({ message: '注册成功' });
      });
    });
  });
};
// 登录用户
exports.login = (req, res) => {
  const { username, password } = req.body;

  // 检查用户名是否存在
  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: '服务器内部错误' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = results[0];

    // 解密密码并验证
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: '服务器内部错误' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 生成 JWT 令牌
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: '1h' // 令牌有效期为1小时
      });

      res.json({ message: '登录成功', token });
    });
  });
};
