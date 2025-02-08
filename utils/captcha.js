const svgCaptcha = require('svg-captcha');

const getCaptcha = () => {
    let captcha = svgCaptcha.create({
          size: 4,
        ignoreChars: '0o1i',
        noise: 3,
        color: true,
        width: 100,
        height: 40,
    });
    return {
        text: captcha.text,
        data: captcha.data,
    };
}

module.exports = {
    getCaptcha,
}
