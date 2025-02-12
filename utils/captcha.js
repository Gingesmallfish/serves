const svgCaptcha = require('svg-captcha');

const getCaptcha = () => {
    let captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 3,
        color: true,
        width: 150, // 增大宽度
        height: 50,
        background: '#f0f0f0', // 设置背景颜色

    });
    return {
        text: captcha.text,
        data: captcha.data,
    };
}

module.exports = {
    getCaptcha,
}
