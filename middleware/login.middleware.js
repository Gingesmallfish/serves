const { verifyCaptcha, findUserByCredentials, generateToken } = require('../services/auth.service');

const loginMiddleware = async (req, res, next) => {
    const { username, password, captcha } = req.body;
    const sessionCaptcha = req.session.captcha;

    if (!verifyCaptcha(captcha, sessionCaptcha)) {
        return res.json({ success: false, message: '验证码错误' });
    }

    try {
        const user = await findUserByCredentials(username, password);
        if (user) {
            const token = generateToken(user.user_id);
            req.loginResult = { success: true, token };
        } else {
            req.loginResult = { success: false, message: '用户名或密码错误' };
        }
    } catch (error) {
        console.error(error);
        req.loginResult = { success: false, message: '登录失败，请稍后重试' };
    }

    next();
};

module.exports = loginMiddleware;
