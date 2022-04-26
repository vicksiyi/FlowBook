const express = require('express');
const router = express.Router();
const passport = require("passport");
const keys = require('../config/keys');
const utils = require('../utils/utils');
const bookrack = require('../model/bookrack');

// $routes /bookrack/create
// 创建书架
// @access public
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { open_id } = req.user;
    const { title, desc, passwd, logo } = req.body;
    const author = open_id;
    const manage = 7;
    let _result = await bookrack.create(title, desc, passwd, logo, manage, author).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200 });
})

// $routes /bookrack/getminebookrack
// 获取我的书架
// @access public
router.get('/getminebookrack/:page', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let page = req.params.page;
    if (page < 1) res.send({ code: 400, msg: '页码错误' });
    else page = page - 1;
    let { open_id, nick_name } = req.user;
    let _result = await bookrack.query_user(open_id, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result.map((value) => {
        value.nick_name = nick_name;
        value.time = utils.formatTimestamp(new Date(value.time).getTime());
        value.is_passwd = value.passwd != '';
        value.passwd = "";
        return value;
    })
    res.send({ code: 200, data: _result })
})

// $routes /bookrack/search?
// 查询书架
// @access public
router.get('/search', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { page, keyword } = req.query;
    if (page < 1) res.send({ code: 400, msg: '页码错误' });
    else page = page - 1;
    let _result = await bookrack.search_title(keyword, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result.map((value) => {
        value.time = utils.formatTimestamp(new Date(value.time).getTime());
        value.is_passwd = value.passwd != '';
        value.passwd = "";
        return value;
    })
    res.send({ code: 200, data: _result })
})
module.exports = router;