const keys = require('../config/keys');
const email = require('emailjs');

exports.formatTimestamp = function (timestamp) {
    var dateObj = new Date(timestamp);

    var year = dateObj.getYear() + 1900;
    var month = dateObj.getMonth() + 1;
    var theDate = dateObj.getDate();
    var hour = dateObj.getHours();
    var minute = dateObj.getMinutes();
    var second = dateObj.getSeconds();
    return year + "-" + month + "-" + theDate + " " + hour + ":" + minute + ":" + second;
}

exports.toJson = function (result) {
    return JSON.parse(JSON.stringify(result));
}

exports.emailSend = function (_email, content, title) {
    const client = new email.SMTPClient(keys.email_server);
    return new Promise((resolve, reject) => {
        client.send({
            text: title,       //邮件内容
            from: '1724264854@qq.com',        //谁发送的
            to: _email,       //发送给谁的
            subject: '流动图书',          //邮件主题
            attachment: { data: content, alternative: true }
        }, function (err, message) {
            if (err) reject(err);
            else resolve(message);
        })
    })
}

exports.getSmsCode = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}