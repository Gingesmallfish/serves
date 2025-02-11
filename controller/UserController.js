const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getCaptcha } = require('../utils/captcha');
const { checkUsernameExistence, insertUser, findUserByUsername } = require('../db/dbQeuries'); // 引入数据库查询模块

const JWT_SECRET = 'token-admin';


exports.getCaptcha = (req, res) => {
  const captcha = getCaptcha(); // 调用验证码生成工具
  req.session.captcha = captcha.text; // 将验证码文本存储在 session 中
  req.session.captchaTime = Date.now(); // 存储验证码生成时间
  res.type('svg');
  res.status(200).send(captcha.data);
};



// 提取验证码验证逻辑
function validateCaptcha(req, captcha) {
  if (!req.session.captcha || !req.session.captchaTime) {
    console.log('验证码或验证码时间缺失');
    return { valid: false, message: '验证码已过期或无效' };
  }

  const captchaTime = req.session.captchaTime;
  const currentTime = Date.now();
  const twoMinutes = 10 * 60 * 1000;

  if (currentTime - captchaTime > twoMinutes) {
    console.log('验证码已过期');
    return { valid: false, message: '验证码已过期' };
  }

  if (req.session.captcha !== captcha) {
    console.log('验证码不匹配');
    return { valid: false, message: '验证码错误' };
  }

  return { valid: true };
}

// 用户注册
exports.register = async (req, res) => {
  const { username, password, confirmPassword, role, captcha } = req.body;
  console.log('接收到的注册数据:', req.body);

  // 检查必填字段
  if (!username || !password || !confirmPassword || !role || !captcha) {
    console.log('缺少必填字段');
    return res.status(400).json({ message: '所有字段都是必填项' });
  }

  if (password !== confirmPassword) {
    console.log('密码和确认密码不一致');
    return res.status(400).json({ message: '密码和确认密码不一致' });
  }

  // 验证验证码
  const captchaValidation = validateCaptcha(req, captcha);
  if (!captchaValidation.valid) {
    return res.status(400).json({ message: captchaValidation.message });
  }

  // 验证用户角色
  if (role !== 1 && role !== 2) {
    console.log('无效的用户角色');
    return res.status(400).json({ message: '用户角色无效' });
  }

  try {
    // 检查用户名是否已存在
    const results = await checkUsernameExistence(username);
    if (results.length > 0) {
      console.log('用户名已存在');
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 加密密码并保存用户
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('密码加密错误:', err);
        return res.status(500).json({ message: '服务器内部错误' });
      }

      insertUser(username, hashedPassword, role)
        .then(() => {
          console.log('用户注册成功');
          res.json({ message: '注册成功' });
        })
        .catch((error) => {
          console.error('数据库错误:', error);
          res.status(500).json({ message: error });
        });
    });
  } catch (error) {
    console.error('错误:', error);
    return res.status(500).json({ message: error });
  }
};

// 用户登录
exports.login = async (req, res) => {
  const { username, password, captcha } = req.body;
  console.log('接收到的登录数据:', req.body);

  // 检查必填字段
  if (!username || !password || !captcha) {
    console.log('缺少必填字段');
    return res.status(400).json({ message: '所有字段都是必填项' });
  }

  // 验证验证码
  const captchaValidation = validateCaptcha(req, captcha);
  if (!captchaValidation.valid) {
    return res.status(400).json({ message: captchaValidation.message });
  }

  try {
    // 检查用户名是否存在
    const results = await findUserByUsername(username);
    if (results.length === 0) {
      console.log('用户名或密码错误');
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = results[0];

    // 验证密码
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('密码比较错误:', err);
        return res.status(500).json({ message: '服务器内部错误' });
      }
      if (!isMatch) {
        console.log('用户名或密码错误');
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 生成 JWT 令牌
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
      });

      console.log('登录成功');
      res.json({ message: '登录成功', token });
    });
  } catch (error) {
    console.error('错误:', error);
    return res.status(500).json({ message: error });
  }
};

// 退出登录
exports.logout = (req, res) => {
  res.clearCookie('token');
  req.session.destroy((err) => {
    if (err) {
      console.error('退出登录错误:', err);
      return res.status(500).json({ message: '服务器内部错误' });
    }
    console.log('退出登录成功');
    res.json({ message: '退出登录成功' });
  });
};
