const express = require('express');
const router = express.Router();
const passport = require("passport");
const user = require('../model/user');
const md5 = require("js-md5");

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
module.exports = router;