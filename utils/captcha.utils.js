const svgCaptcha = require('svg-captcha');

/**
 * 生成验证码
 *
 * 此函数使用svgCaptcha库创建一个SVG格式的验证码
 * 它返回一个对象，其中包含验证码的文本和SVG数据
 * 这用于在网页上显示验证码，以增加用户验证过程的安全性
 *
 * @returns {Object} 验证码对象，包含文本和SVG数据
 */
const generateCaptcha = () => {
    const img = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 3,
        color: true,
        width: 150,
        height: 40,
    });
    return {
        text: img.text,
        data: img.data,
    };
};

module.exports = {
    generateCaptcha
};
