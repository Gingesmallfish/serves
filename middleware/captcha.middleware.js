const { generateCaptcha } = require('../utils/captcha.utils');

const captchaMiddleware = (req, res, next) => {
    try {
        const captcha = generateCaptcha();
        console.log('Generated Captcha:', captcha);

        if (!req.session) {
            console.error('Session is not available');
            return res.status(500).send('Session not configured');
        }

        req.session.captcha = captcha.text;
        res.type('svg');
        res.send(captcha.data);
    } catch (error) {
        console.error('Error in captcha middleware:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = captchaMiddleware;
