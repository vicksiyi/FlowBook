const express = require('express');
const router = express.Router();
const passport = require("passport");
const axios = require('../utils/request');
const keys = require('../config/keys');
const utils = require('../utils/utils');
const user = require('../model/user');
const md5 = require('js-md5');
const jwt = require('jsonwebtoken');
const redisHandle = require('../utils/redis');

// 验证Code & 获取openId
const oauthCode = function (code) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${keys.APPID}&secret=${keys.SECRET}&js_code=${code}&grant_type=authorization_code`;
    return new Promise((resolve, reject) => {
        axios.get({ url }).then(res => {
            resolve(res);
        }).catch(err => { reject(err); })
    })
}

// 生成token
const jwtToken = function (rule) {
    return new Promise((resolve, reject) => {
        jwt.sign(rule, keys.secretUser, { expiresIn: 3600 }, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        })
    })
}

// $routes /oauth/authlogin/:code
// 授权登录获取token
// @access public
router.get('/authlogin/:code', async (req, res) => {
    const code = req.params.code;
    const _result = await oauthCode(code);
    if (_result.openid) {
        const rule = { openId: _result.openid };
        let _user = utils.toJson(await user.query_openid(_result.openid, '').catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        }))[0];
        if (_user.num === 0) { //未注册
            res.json({ code: 301, msg: '未注册' })
        } else {
            jwtToken(rule).then(async token => {
                res.json({
                    code: 200, token: 'Bearer ' + token
                })
            }).catch(err => {
                res.json({ code: 400, msg: '未知错误' })
                throw new Error(err);
            })
        }
    }
    else res.send({ code: 400, msg: 'code失效' });
})

// $routes /oauth/accountlogin
// 账号登录
// @access public
router.post('/accountlogin', async (req, res) => {
    const { code, email, password } = req.body;
    const _result = await oauthCode(code);
    if (_result.openid) {
        let _user = await user.query_user('', email).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        });
        if (_user.length === 0) { //未注册
            res.json({ code: 400, msg: '用户不存在' })
        } else if (_user[0].passwd == md5(_user[0].open_id + password)) {
            const rule = { openId: _result.openid };
            jwtToken(rule).then(async token => {
                res.json({
                    code: 200, token: 'Bearer ' + token
                })
            }).catch(err => {
                res.json({ code: 400, msg: '未知错误' })
                throw new Error(err);
            })
        } else {
            res.json({ code: 400, msg: '密码错误' })
        }
    }
    else res.send({ code: 400, msg: 'code失效' });
})

// $routes /oauth/emaillogin
// 邮箱验证登录
// @access public
router.post('/emaillogin', async (req, res) => {
    const { code, email, emailCode } = req.body;
    const _result = await oauthCode(code);
    if (_result.openid) {
        let _user = await user.query_user('', email).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        });
        let _emailCode = await redisHandle.getKey(`login:${email}`);
        if (_user.length === 0) { //未注册
            res.json({ code: 400, msg: '用户不存在' })
        } else if (_emailCode != null && emailCode == _emailCode) {
            redisHandle.setTtlKey(`login:${email}`, 0, 60);
            const rule = { openId: _result.openid };
            jwtToken(rule).then(async token => {
                res.json({
                    code: 200, token: 'Bearer ' + token
                })
            }).catch(err => {
                res.json({ code: 400, msg: '未知错误' })
                throw new Error(err);
            })
        } else {
            res.json({ code: 400, msg: '验证码错误' })
        }
    }
    else res.send({ code: 400, msg: 'code失效' });
})

// $routes /oauth/sendloginemail/:email
// 发送邮箱【用于登录】
// @access public
router.put('/sendloginemail/:email', async (req, res) => {
    const { email } = req.params;
    const code = utils.getSmsCode(1000, 9999);
    const content = `验证码：${code}`;
    const title = '邮箱登录验证';
    const reply = await redisHandle.getTtlKey(`login:${email}`);
    if (reply == 0) {
        res.send({ code: 400, msg: "禁止频繁发送" });
        return;
    }
    let _temp = await utils.emailSend(email, content, title).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (reply === -2 || reply < 3540) {
        redisHandle.setTtlKey(`login:${email}`, code, 3600);
        res.json({ code: 200 })
    } else {
        res.send({ code: 400, msg: "禁止频繁发送" });
    }
})

// $routes /oauth/register
// 注册
// @access public
router.post('/register', async (req, res) => {
    let { code, avatarUrl, nickName, desc, email, password, emailCode } = req.body;
    const _result = await oauthCode(code);
    if (_result.openid) {
        let _emailCode = await redisHandle.getKey(`register:${email}`);
        if (_emailCode == null || emailCode != _emailCode) {
            res.json({ code: 400, msg: '验证码不正确' })
            return;
        }
        redisHandle.setTtlKey(`register:${email}`, 0, 60);
        let _user = utils.toJson(await user.query_openid(_result.openid, email).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        }))[0];
        if (_user.num === 1) {
            res.json({ code: 400, msg: '请勿重复注册' })
            return;
        }
        password = md5(_result.openid + password);
        let _temp = await user.register(_result.openid, avatarUrl, nickName, desc, email, password).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        });
        res.send({ code: 200 })
    }
    else res.send({ code: 400, msg: 'code失效' });
})

// $routes /oauth/sendemail/:email
// 发送邮箱【用于注册】
// @access public
router.put('/sendemail/:email', async (req, res) => {
    const { email } = req.params;
    const code = utils.getSmsCode(1000, 9999);
    const content = `验证码：${code}`;
    const title = '邮箱验证';
    const reply = await redisHandle.getTtlKey(`register:${email}`);
    if (reply == 0) {
        res.send({ code: 400, msg: "禁止频繁发送" });
        return;
    }
    let _temp = await utils.emailSend(email, content, title).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (reply === -2 || reply < 3540) {
        redisHandle.setTtlKey(`register:${email}`, code, 3600);
        res.json({ code: 200 })
    } else {
        res.send({ code: 400, msg: "禁止频繁发送" });
    }
})

// $routes /oauth/oauthtoken
// 验证token
// @access private
router.put('/oauthtoken', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({
        code: 200
    })
})
module.exports = router;