const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getCaptcha } = require('../utils/captcha');
const { checkUsernameExistence, insertUser, findUserByUsername } = require('../models/dbQeuries');

const JWT_SECRET = 'token-admin';

// 获取验证码
exports.getCaptcha = (req, res) => {
    try {
        const captcha = getCaptcha();
        req.session.captcha = captcha.text;
        req.session.captchaTime = Date.now();
        res.type('svg');
        res.status(200).send(captcha.data);
    } catch (error) {
        console.error('生成验证码出错:', error);
        res.status(500).json({ message: '服务器内部错误，请稍后重试' });
    }
};

// 提取验证码验证逻辑
function validateCaptcha(req, captcha) {
    if (!req.session.captcha || !req.session.captchaTime) {
        console.log('验证码或验证码时间缺失');
        return { valid: false, message: '验证码已过期或无效' };
    }
    const captchaTime = req.session.captchaTime;
    const currentTime = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    if (currentTime - captchaTime > tenMinutes) {
        console.log('验证码已过期');
        return { valid: false, message: '验证码已过期' };
    }
    if (req.session.captcha!== captcha) {
        console.log('验证码不匹配');
        return { valid: false, message: '验证码错误' };
    }
    return { valid: true };
}

// 用户注册
exports.register = async (req, res) => {
    const { username, password, confirmPassword, role, captcha, name, phone, sex } = req.body;
    console.log('接收到的注册数据:', req.body);

    // 检查必填字段
    const requiredFields = ['username', 'password', 'confirmPassword', 'role', 'captcha', 'name', 'phone', 'sex'];
    const missingFields = requiredFields.filter(field =>!req.body[field]);
    if (missingFields.length > 0) {
        console.log('缺少必填字段:', missingFields);
        return res.status(400).json({ message: `缺少必填字段: ${missingFields.join(', ')}` });
    }

    if (password!== confirmPassword) {
        console.log('密码和确认密码不一致');
        return res.status(400).json({ message: '密码和确认密码不一致' });
    }

    // 验证验证码
    const captchaValidation = validateCaptcha(req, captcha);
    if (!captchaValidation.valid) {
        return res.status(400).json({ message: captchaValidation.message });
    }

    // 验证用户角色
    const validRoles = [1, 2, 3];
    const parsedRole = parseInt(role);
    if (!validRoles.includes(parsedRole)) {
        console.log('无效的用户角色');
        return res.status(400).json({ message: '用户角色无效，必须是 1（学生）、2（教师）或 3（管理员）' });
    }

    // 验证手机号码格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        console.log('无效的手机号码');
        return res.status(400).json({ message: '请输入有效的手机号码' });
    }

    try {
        // 检查用户名是否已存在
        const results = await checkUsernameExistence(username);
        if (results.length > 0) {
            console.log('用户名已存在');
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 加密密码并保存用户
        const hashedPassword = await bcrypt.hash(password, 10);
        await insertUser(username, hashedPassword, parsedRole, name, phone, sex);
        console.log('用户注册成功');
        res.json({ message: '注册成功' });
    } catch (error) {
        console.error('注册出错:', error);
        res.status(500).json({ message: '服务器内部错误，请稍后重试' });
    }
};

// 用户登录
exports.login = async (req, res) => {
    const { username, password, captcha } = req.body;
    console.log('接收到的登录数据:', req.body);

    // 检查必填字段
    const requiredFields = ['username', 'password', 'captcha'];
    const missingFields = requiredFields.filter(field =>!req.body[field]);
    if (missingFields.length > 0) {
        console.log('缺少必填字段:', missingFields);
        return res.status(400).json({ message: `缺少必填字段: ${missingFields.join(', ')}` });
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
        const isMatch = await bcrypt.compare(password, user.password);
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
    } catch (error) {
        console.error('登录出错:', error);
        res.status(500).json({ message: '服务器内部错误，请稍后重试' });
    }
};

// 退出登录
exports.logout = (req, res) => {
    res.clearCookie('token');
    req.session.destroy((err) => {
        if (err) {
            console.error('退出登录错误:', err);
            return res.status(500).json({ message: '服务器内部错误，请稍后重试' });
        }
        console.log('退出登录成功');
        res.json({ message: '退出登录成功' });
    });
};
