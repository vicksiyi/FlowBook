const express = require('express');
const router = express.Router();
const passport = require("passport");
const user = require('../model/user');
const md5 = require("js-md5");
const utils = require('../utils/utils');
const redisHandle = require('../utils/redis');

// $routes /user/mine
// 获取个人信息
// @access private
router.get('/mine', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { avatar, nick_name, desc, email, time } = req.user;
    res.json({
        code: 200,
        data: { avatar, nick_name, desc, email, time }
    })
})

// $routes /user/edit
// 修改个人信息
// @access private
router.put('/edit', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { open_id } = req.user;
    let { avatar, nick_name, desc } = req.body;
    let _result = await user.edit_user(avatar, nick_name, desc, open_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200 })
})


// $routes /user/editpasswd
// 修改用户密码
// @access private
router.put('/editpasswd', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { open_id, passwd } = req.user;
    let { old_passwd, new_passwd } = req.body;
    old_passwd = md5(open_id + old_passwd);
    if (old_passwd != passwd) {
        res.json({ code: 400, msg: '旧密码不正确' })
        return;
    }
    new_passwd = md5(open_id + new_passwd);
    let _result = await user.edit_passwd(open_id, new_passwd).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200 })
})

// $routes /user/sendemail
// 发送邮箱【用于修改】
// @access private
router.put('/sendemail', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { email } = req.body;
    const code = utils.getSmsCode(1000, 9999);
    const content = `验证码：${code}`;
    const title = '邮箱修改验证';
    const reply = await redisHandle.getTtlKey(`editemail:${email}`);
    if (reply == 0) {
        res.send({ code: 400, msg: "禁止频繁发送" });
        return;
    }
    let _temp = await utils.emailSend(email, content, title).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (reply === -2 || reply < 3540) {
        redisHandle.setTtlKey(`editemail:${email}`, code, 3600);
        res.json({ code: 200 })
    } else {
        res.send({ code: 400, msg: "禁止频繁发送" });
    }
})

// $routes /user/sendemail
// 发送邮箱【用于修改】
// @access private
router.post('/editemail', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { open_id, email } = req.user;
    let { new_email, old_email_code, new_email_code } = req.body;
    let old_email = email;
    // 1、验证code
    let _old_email_code = await redisHandle.getKey(`editemail:${old_email}`);
    if (_old_email_code == null || _old_email_code != old_email_code) {
        res.json({ code: 400, msg: '原邮箱验证码不正确' })
        return;
    }
    // 2、验证新邮箱code
    let _new_email_code = await redisHandle.getKey(`editemail:${new_email}`);
    if (_new_email_code == null || _new_email_code != new_email_code) {
        res.json({ code: 400, msg: '新邮箱验证码不正确' })
        return;
    }
    // 3、判断新邮箱是否已经被使用
    let _result = await user.query_user('', new_email).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length > 0) {
        res.json({ code: 400, msg: '邮箱已被占用' })
        return;
    }
    // 4、修改邮箱
    _result = await user.edit_user_email(new_email, open_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    redisHandle.setTtlKey(`editemail:${old_email}`, 0, 60);
    redisHandle.setTtlKey(`editemail:${new_email}`, 0, 60);
    res.json({ code: 200 })
})
module.exports = router;