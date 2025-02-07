const { verifyCaptcha, findUserByUsername, registerUser } = require('../services/auth.service');

const registerMiddleware = async (req, res, next) => {
    const { username, password, captcha, role } = req.body;
    const sessionCaptcha = req.session.captcha;

    if (!verifyCaptcha(captcha, sessionCaptcha)) {
        return res.json({ success: false, message: '验证码错误' });
    }

    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            req.registerResult = { success: false, message: '用户名已存在' };
        } else {
            const registered = await registerUser(username, password, role);
            if (registered) {
                req.registerResult = { success: true, message: '注册成功' };
            } else {
                req.registerResult = { success: false, message: '注册失败，请稍后重试' };
            }
        }
    } catch (error) {
        console.error(error);
        req.registerResult = { success: false, message: '注册失败，请稍后重试' };
    }

    next();
};

module.exports = registerMiddleware;
